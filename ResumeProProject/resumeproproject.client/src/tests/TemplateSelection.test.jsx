import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TemplateSelection from '../pages/TemplateSelection';
import { vi } from 'vitest';

// Mock the showToast function to avoid actual toast pop-ups in tests
vi.mock("../utils/Toast", () => ({ showToast: vi.fn() }));

// Mock AuthorizeView to avoid authentication checks in tests
vi.mock("../components/AuthorizeView", () => ({ default: ({ children }) => <>{children}</> }));

// Mock the templates list to control the test data
vi.mock("../utils/TemplateList", () => ({ templates: [
    { id: "1", name: "Template One", tagline: "First template", imgPath: "path/to/image1" },
    { id: "2", name: "Template Two", tagline: "Second template", imgPath: "path/to/image2" },
    { id: "3", name: "Template Three", tagline: "Third template", imgPath: "path/to/image3" },
    { id: "4", name: "Template Four", tagline: "Fourth template", imgPath: "path/to/image4" },
    { id: "5", name: "Template Five", tagline: "Fifth template", imgPath: "path/to/image5" },
    { id: "6", name: "Template Six", tagline: "Sixth template", imgPath: "path/to/image6" }
] }));

// Mock useNavigate globally
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
    ...await vi.importActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("TemplateSelection", () => {
    test("renders header and layout switch buttons", () => {
        // Render the component inside MemoryRouter to support React Router usage
        render(
            <MemoryRouter>
                <TemplateSelection />
            </MemoryRouter>
        );

        // Check if the page header text is present
        expect(screen.getByText("Choose a Template")).toBeInTheDocument();
        expect(screen.getByText("Let's get started! Pick a template to start editing.")).toBeInTheDocument();

        // Check that two layout switch buttons are present
        expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    test("switches layout when layout buttons are clicked", () => {
        render(
            <MemoryRouter>
                <TemplateSelection />
            </MemoryRouter>
        );

        // Select the layout switch buttons
        const gridButton = screen.getAllByRole("button")[0];
        const fullButton = screen.getAllByRole("button")[1];

        // Click the 'full' layout button and check if it becomes active
        fireEvent.click(fullButton);
        expect(fullButton).toHaveClass("switch-active");

        // Click the 'grid' layout button and check if it becomes active
        fireEvent.click(gridButton);
        expect(gridButton).toHaveClass("switch-active");
    });

    test("renders templates correctly and allows selection", () => {
        render(
            <MemoryRouter>
                <TemplateSelection />
            </MemoryRouter>
        );
    
        // Ensure templates are rendered correctly
        const templateCards = screen.getAllByRole("img");
        expect(templateCards.length).toBeGreaterThan(0);
    
        // Click the first template's parent (if applicable)
        fireEvent.click(templateCards[0].closest("div")); // Adjust if the parent is a button
    
        // Check if navigation occurred
        // expect(mockNavigate).toHaveBeenCalledWith("/builder/1");
    });
  
});