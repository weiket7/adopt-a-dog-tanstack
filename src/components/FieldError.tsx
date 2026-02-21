export function FieldError({ errors }: { errors: any[] }) {
  if (errors.length === 0) return null;

  return (
    <div className="invalid-feedback">
      {errors
        .map((error) => (typeof error === "object" ? error.message : error))
        .join(", ")}
    </div>
  );
}
