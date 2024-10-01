// Componente reutilizable para un input de texto
const TextInput = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-secondary">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
      required={required}
    />
  </div>
);

// Componente reutilizable para un input de fecha
const DateInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-secondary">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
);

// Componente reutilizable para un input select
const SelectInput = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-secondary">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export { TextInput, DateInput, SelectInput };
