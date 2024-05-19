import TaskList from "@/components/TaskList";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Task list", () => {
  it("renders a heading", () => {
    render(<TaskList />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
