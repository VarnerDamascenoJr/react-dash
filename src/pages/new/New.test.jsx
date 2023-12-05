import {render, screen} from "@testing-library/react"
import New from "./New.jsx" 
test("user", ()=>{
    render(<New/>)
    const emailInputEmail = screen.getAllByPlaceholderText(/Email/i)
    expect(emailInputEmail).toBeInTheDocument()
})


test("Button input should be rendered", ()=>{
    render(<New/>)
    const buttonInputEl = screen.getByRole("button")
    expect(buttonInputEl).toBeInTheDocument()
})

///https://handsonreact.com/docs/labs/js/T6-TestingForms

//https://www.freecodecamp.org/news/write-unit-tests-using-react-testing-library/