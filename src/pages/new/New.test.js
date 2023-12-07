
import { render, screen } from "@testing-library/react"
import New from "./New"


test("Placeholder Email text", ()=>{
    render(<New/>)
    const userInputel = screen.getAllByPlaceholderText(/Email/i);
    expect(userInputel).toBeInTheDocument();
})

test("Placeholder Phone text", ()=>{
    render(<New/>)
    const userInputel = screen.getAllByPlaceholderText("+1-222-333");
    expect(userInputel).toBeInTheDocument();
})

test("Placeholder password text", ()=>{
    render(<New/>)
    const userInputel = screen.getAllByPlaceholderText(/password/i);
    expect(userInputel).toBeInTheDocument();
})

















///https://handsonreact.com/docs/labs/js/T6-TestingForms

//https://www.freecodecamp.org/news/write-unit-tests-using-react-testing-library/

