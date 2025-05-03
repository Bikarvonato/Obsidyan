// src/components/ui/Input.jsx — versión corregida
export default function Input({ className = '', ...rest }) {
  return (
    <input
      {...rest}                        // reenvía name, value, onChange, etc.
      className={`input-base ${className}`.trim()}
    />
  );
}