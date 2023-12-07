import { useState } from "react";
import { Input } from "./Input";
import { TextPlaceholder } from "./TextPlaceholder";

export const Form = () => {
  const [isCompany, setIsCompany] = useState(true);

  return (
    <div>
      {/* Create a checkbox to let user choose if it is a company */}
      <label style={{ fontSize: "1.3rem" }} htmlFor="is-company">
        Is company
      </label>
      <input
        type="checkbox"
        id="is-company"
        checked={isCompany}
        onChange={() => setIsCompany(!isCompany)}
      />
      {isCompany ? (
        <Input id="company-id" placeholder="Company Id" />
      ) : (
        <TextPlaceholder />
        // <Input id="personal-id" placeholder="Personal Id" />
      )}
    </div>
  );
};
