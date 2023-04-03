/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})

//----------------------------------------Unit test Containers/NewBill----------------------------------------

/**
 * @ function handleChangeFile
 */

describe('handleChangeFile Unit Test Suites', () => {
  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should find a file extension', () => (
    expect(handleChangeFile()).fileExtension.toBeDefined
  ))

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should create and store a new bill', () => (
    expect(handleChangeFile.create.data).toEqual(FormData)
  ))
})

/**
 * @ function handleSubmit
 */

//+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
describe('handleSubmit Unit Test Suites', () => {
  it ('should contain a bill with several values', () => (
    expect(handleSumit.bill).toBeDefined
    ))
    
  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should switch on bills page', () => (
    expect(handleSumit.onNavigate).toBe("127.0.0.1:8080/#employee/bills")
  ))
})

/**
 * @ function displayErrorMessage
 */

describe('displayErrorMessage Unit Test Suites', () => {

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should create a modal of error', () => (
    expect(displayErrorMessage.container).toContain(divModal)
  ))

})

//----------------------------------------Integration test Containers/Bills----------------------------------------

//+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++

describe("Given I am connected as an employee", () => {
  describe("When I am on New Bill page", () => {
    test("Then I should see a form to complete", () => {

    })

    test("Then I should be able to add a new file", () => {

    })
  })

  describe("When I have completed the form of a newBill and click on submit", () => {
    test("Then I should see my new bill on the bills page", () => {

    })
  })

  describe("When I add a new bill on New Bill page", () => {
    test("Then I should only be able to add 'jpeg', 'jpg' or 'png' files", () => {

    })
  })

  describe("When I am on New Bill page and want to add a new file which is not a 'jpeg', 'jpg' or 'png' file", () => {
    test("Then I should see a modal explaining me my error and why I can't do it", () => {

    })
  })

  describe("When I am on New Bill page and see the error modal", () => {
    test("Then I should be able to close it", () => {

    })
  })
})