/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent } from '@testing-library/dom'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see a form to complete", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const formNewBill = document.querySelector('[data-testid="form-new-bill"]');
      expect(formNewBill).toBeDefined();
      expect(formNewBill.childElementCount).toBe(2);
      const rowInForm = document.querySelectorAll('row');
      rowInForm.forEach(row => {
        expect(row.childElementCount.classList).toContain('col-md-6');
      });
    })

    test("Then I should see a submit button", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const submitButton = document.getElementById("btn-send-bill");
      expect(submitButton).toBeDefined();
    });
  })
})

//----------------------------------------Unit test Containers/NewBill----------------------------------------

// Create a constante store with mocked functions returning a resolved Promise for them to "successful"
const store = {
  bills: jest.fn(() => ({
    create: jest.fn(() => Promise.resolve({ fileUrl: 'http://test.com', key: '12345'}))
  }))
};

/**
 * @ function handleChangeFile
 */

describe('handleChangeFile Unit Test Suites', () => {

  beforeEach(() => {
    const user = { "type":"Employee", "email":"employee@test.tld", "password":"employee", "status":"connected" };
    localStorage.setItem("user", JSON.stringify(user));
  })
  
  it ('should display an error message for files with invalid extension', async () => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const fileInput = newBillInstance.document.querySelector('input[data-testid="file"]');
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['test file content'], 'test.txt', { type : 'text/plain' })]
      }
    });
    const event = { preventDefault : jest.fn() }; // create a mock event object with a preventDefault function. To prevent the test to fail
    await newBillInstance.handleChangeFile(event);
    expect(newBillInstance.displayErrorMessage()).toHaveBeenCalled();
  })

  it ('should create a new bill for files with valid extensions', async () => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const fileInput = newBillInstance.document.querySelector('input[data-testid="file"]');
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['test file content'], 'test.jpg', { type : 'image/jpeg' })]
      }
    });
    const event = { preventDefault : jest.fn() }; // create a mock event object with a preventDefault function. To prevent the test to fail
    const newBill = await newBillInstance.handleChangeFile(event);
    expect(newBill.fileUrl).toBeDefined();
    expect(newBill.billId).toBeDefined();
    expect(newBill.fileName).toBeDefined();
  })
})

/**
 * @ function handleSubmit
 */

//+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
describe('handleSubmit Unit Test Suites', () => {
  it ('should contain a form with several input values', async() => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const newBill = await newBillInstance.handleSubmit();
    expect(newBill.bill).toBeDefined;
  })
    
  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should switch on bills page', async () => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const newBill = await newBillInstance.handleSubmit();
    expect(newBill.onNavigate).toBe("127.0.0.1:8080/#employee/bills")
  })
})

/**
 * @ function displayErrorMessage
 */

describe('displayErrorMessage Unit Test Suites', () => {

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should create a modal of error', async () => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const newBill = await newBillInstance.displayErrorMessage();
    expect(newBill.container).toContain(divModal);
  })

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