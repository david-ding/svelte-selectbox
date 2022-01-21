import { act, fireEvent, render } from "@testing-library/svelte";
import Select from "$lib";

const getTextContent = (element: HTMLElement): string => {
  return element.textContent.trim();
};

test("default select", async () => {
  const subject = render(Select, {
    options: [
      { label: "Option 1", value: "O1" },
      { label: "Option 2", value: "O2" },
    ],
  });

  await act(async () => fireEvent.click(subject.getByTestId("selector")));

  const options = subject.getAllByRole("option");
  expect(options.map(getTextContent)).toEqual(["Option 1", "Option 2"]);
});
