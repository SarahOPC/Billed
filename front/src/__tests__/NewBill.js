/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import request from 'supertest'
import app from '../app'


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
    create: jest.fn(() => Promise.resolve({ fileUrl: 'http://test.com', key: '12345'})),
    update: jest.fn(() => Promise.resolve())
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
    expect(() => { newBillInstance.displayErrorMessage() }).not.toThrow();
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
    const e = { 
      target: {
        value: 'C:\\fakepath\\test.jpg'
      },
      preventDefault : jest.fn()
    }; // create a mock event object with a preventDefault function and a target value(to prevent e.target = undefined). To prevent the test to fail
    const fileUrl = await newBillInstance.store.bills().create();
    expect(fileUrl).toBeDefined();
  })
})

/**
 * @ function handleSubmit
 */

describe('handleSubmit Unit Test Suites', () => {
  it ('should contain a form with several input values', async() => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const e = { 
      target: {
        querySelector: jest.fn().mockReturnValue({ value: 'test' })
      },
      preventDefault : jest.fn()
    };
    const bill = await newBillInstance.handleSubmit(e);
    expect(bill).toBeDefined;
    const form = await newBillInstance.document.querySelector('[data-testid="form-new-bill"]');
    expect(form).toContainElement(document.querySelector('[data-testid="expense-type"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="expense-name"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="datepicker"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="amount"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="vat"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="pct"]'));
    expect(form).toContainElement(document.querySelector('[data-testid="file"]'));
  })

  it ('should switch on bills page', async () => {
    const ROUTES_PATH = { Bills: '#employee/bills' } ;
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const updateBill = jest.fn();
    const newBillInstance = new NewBill({document, onNavigate, updateBill, store, localStorage});
    const e = { 
      target: {
        querySelector: jest.fn().mockReturnValue({ value: 'test' })
      },
      preventDefault : jest.fn()
    };
    
    await expect(newBillInstance.handleSubmit(e)).toBeUndefined(); // because doesn't return anything in the original code
    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
  })
})

/**
 * @ function displayErrorMessage
 */

describe('displayErrorMessage Unit Test Suites', () => {

  it ('should create a modal of error', async () => {
    const onNavigate = jest.fn(); // Create a mock function with jest.fn() method
    const newBillInstance = new NewBill({document, onNavigate, store, localStorage});
    const container = document.querySelector(".content");
    await expect(container).toContainElement(document.getElementById('myModal'));
  })

})

//----------------------------------------Integration test Containers/Bills----------------------------------------

describe("Given I am connected as an employee", () => {
  describe("When I have correctly completed the form of a newBill and click on submit", () => {
    test("Then I should see my new bill on the bills page", () => {
      const titleNewBill = document.querySelector('[data-testid="expense-name"]');
      const submitButton = document.getElementById("btn-send-bill");
      submitButton.addEventListener("click", function() {
        const currentUrl = window.location.href;
        const ROUTES_PATH = { Bills: '#employee/bills' } ;
        expect(currentUrl).toBe(ROUTES_PATH['Bills']);
        const firstBillName = document.querySelectorAll('[data-testid="tbody"].tr[0].td[1]');
        expect(firstBillName).toEqual(titleNewBill);
      })
    })
  })

  describe("When I add a new bill on New Bill page", () => {
    test("Then I should be able to add a 'jpeg', 'jpg' or 'png' file", () => {
      const fileButton = document.querySelector('[data-testid="file"]');
      fileButton.addEventListener("click", function() {
        const fileName = document.querySelectorAll("input.form-control")[5].value;
        const fileExtension = fileName.split(".")[1];
        expect(fileExtension).toEqual("png" || "jpg" || "jpeg");
      })
    })
  })

  describe("When I am on New Bill page and want to add a new file which is not a 'jpeg', 'jpg' or 'png' file", () => {
    test("Then I should see a modal explaining me my error and why I can't do it", () => {
      const fileButton = document.querySelector('[data-testid="file"]');
      fileButton.addEventListener("click", function() {
        const fileName = document.querySelectorAll("input.form-control")[5].value;
        const fileExtension = fileName.split(".")[1];
        if(fileExtension != "png" || fileExtension != "jpg" || fileExtension != "jpeg") {
          const errorModal = document.getElementById('myModal');
          expect(errorModal.style.display).toBe("block");
        }
      })
    })
  })
})

//----------------------------------------Integration test POST----------------------------------------

describe("Given I am connected as an Employee", () => {
  describe("When I correctly complete the form of a newBill and click on submit", () => {
    test("Then I should change webpage and see my new bill on the bills page", async () => {
      const data = {
        type: document.querySelector('[data-testid="expense-type"]'),
        name: document.querySelector('[data-testid="expense-name"]'),
        date: document.querySelector('[data-testid="datepicker"]'),
        amount: document.querySelector('[data-testid="amount"]'),
        vat: document.querySelector('[data-testid="vat"]'),
        pct: document.querySelector('[data-testid="pct"]'),
        commentary: document.querySelector('[data-testid="commentary"]'),
        file: document.querySelector('[data-testid="file"]')
      }

      data.type.value = "Transports";
      data.name.value = "Vol CDG-YUL";
      data.date.value = "06/19/2020";
      data.amount.value = "500";
      data.vat.value = "70";
      data.pct.value = "20";
      data.commentary.value = "Vive l'été au Canada";
      data.file.value = "erable.jpg";

      const response = await request(app)
        .post('/newBill')
        .send(data)

      const submitButton = document.getElementById("btn-send-bill");
      submitButton.addEventListener("click", function() {
        const currentUrl = window.location.href;
        const ROUTES_PATH = { Bills: '#employee/bills' } ;
        expect(currentUrl).toBe(ROUTES_PATH['Bills']);
        const firstBillName = document.querySelectorAll('[data-testid="tbody"].tr[0].td[1]');
        expect(firstBillName).toEqual(data.name.value);
        expect(response.status).toBe(200)
      })
    })
  })

  describe("When an error occurs on API", () => {
    test("Then I send a newBill to API and fails with 404 message error", async () => {
      const response = await request(app).post('/newBills')
      expect(response.status).toBe(404)
    })

    test("Then I send invalid data to API and fails with 500 message error", async () => {
      const data = {
        type: document.querySelector('[data-testid="expense-type"]'),
        name: document.querySelector('[data-testid="expense-name"]'),
        date: document.querySelector('[data-testid="datepicker"]'),
        amount: document.querySelector('[data-testid="amount"]'),
        vat: document.querySelector('[data-testid="vat"]'),
        pct: document.querySelector('[data-testid="pct"]'),
        commentary: document.querySelector('[data-testid="commentary"]'),
        file: document.querySelector('[data-testid="file"]')
      }

      data.type.value = "333";
      data.name.value = "333";
      data.date.value = "333";
      data.amount.value = "333";
      data.vat.value = "70";
      data.pct.value = "20";
      data.commentary.value = "333";
      data.file.value = "erable.webp";

      const response = await request(app)
        .post('/newBill')
        .send(data)

      const submitButton = document.getElementById("btn-send-bill");
      submitButton.addEventListener("click", function() {
        expect(response.status).toBe(500)
      })
    })
  })
})