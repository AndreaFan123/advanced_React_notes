export const Input = ({
  id,
  placeholder,
}: {
  id: string;
  placeholder: string;
}) => {
  return (
    <div style={{ display: "flex", gap: ".5rem", fontSize: "1.2rem" }}>
      <label htmlFor="company-id">Id</label>
      <input
        style={{ padding: ".5rem 1rem" }}
        type="text"
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
};
