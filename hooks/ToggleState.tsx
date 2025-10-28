import { useState } from "react";

export default function useToggleState(
  initValue?: boolean
): [boolean, () => void] {
  const [active, setActive] = useState<boolean>(initValue ?? false);
  const toggle = () => {
    setActive((p) => !p);
  };
  return [active, toggle];
}
