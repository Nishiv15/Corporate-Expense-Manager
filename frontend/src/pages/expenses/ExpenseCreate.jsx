import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createExpense } from "../../api/expense.api";

const CreateExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    department: "",
    items: [
      { description: "", quantity: 1, unitPrice: 0 }
    ],
    attachments: []
  });

  const calculateTotalAmount = () => {
    return form.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index)
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = calculateTotalAmount();
    if (!form.title || !form.department) {
      toast.error("Title and department are required");
      return;
    }

    if (!form.items[0].description) {
      toast.error("Item description is required");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("Total amount must be greater than 0");
      return;
    }

    const payload = {
      title: form.title,
      department: form.department,
      items: form.items,
      totalAmount,
      attachments: form.attachments,
      status: "draft"
    };

    try {
      setLoading(true);
      await createExpense(payload);
      toast.success("Expense saved as draft");
      navigate("/app/expenses");
    } catch (error) {
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Create Expense
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-6"
      >
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Title *"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Expense title"
          />

          <Input
            label="Department *"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="HR / IT / Finance"
          />
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="font-medium text-gray-700 mb-3">
            Expense Items *
          </h2>

          {form.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3"
            >
              <Input
                label="Description *"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />

              <Input
                label="Quantity"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />

              <Input
                label="Unit Price"
                type="number"
                className="appearance-none"
                min={0}
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", Number(e.target.value))
                }
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-sm text-red-500 mt-6"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Add Item
          </button>
        </div>

        {/* TOTAL */}
        <div className="text-right text-sm font-medium text-gray-700">
          Total Amount: ₹{calculateTotalAmount()}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save (Draft)"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/app/expenses")}
            className="px-6 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpense;

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);
