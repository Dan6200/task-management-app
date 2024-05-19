import TaskList from "@/components/TaskList";
import { userIdPromise } from "@/stores/TaskStore";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

test("A string containing the user Id", async () => {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ userId: "mock user" }) })
  );
  const { userId } = await userIdPromise();
  expect(typeof userId).toBe("string");
});

describe("Task list", () => {
  it("renders a heading", () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ userId: "mock user" }) })
    );
    render(<TaskList />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
