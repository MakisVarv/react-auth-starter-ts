import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("renders a heading", () => {
  render(<h1>React Auth Starter</h1>);

  expect(screen.getByRole("heading")).toBeInTheDocument();
});
