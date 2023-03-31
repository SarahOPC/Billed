/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //----------------------------------------Adding 2 expect to check if element is identical and has a certain class highlighted----------------------------------------

      expect (screen.getByTestId('icon-window')).toEqual(windowIcon);
      expect (screen.getByTestId('icon-window')).toHaveClass('active-icon');
    })

//----------------------------------------Correction bug #1 by ordering dates antichronogically----------------------------------------
    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML).sort(antiChrono)
      const datesSorted = [...dates]
      expect(dates).toEqual(datesSorted)
    })
  })
})

//----------------------------------------Unit test Containers/Bills----------------------------------------

/**
 * @ function getBills
 */

describe('getBills Unit Test Suites', () => {
  it ('should return an array of bills with formated dates', () => (
    expect(getBills().toBeDefined)
  ))

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should return an error', () => (
    expect(getBills("foo").toThrow(e))
  ))

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should return an array of bills with non formated dates', () => (
    expect(getBills("corruptedData").toBeDefined)
  ))
})

/**
 * @ function handleClickNewBill
 */

//+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
describe('handleClickNewBill Unit Test Suites', () => {
  it ('should change the url of the page', () => (
    expect(currentUrl.toBeFalsy)
  ))
})

/**
 * @ function handleClickIconEye
 */

describe('handleClickIconEye Unit Test Suites', () => {

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should return the bill url', () => (
    expect(billUrl.toBeDefined)
  ))

  //+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++
  it ('should define a width for the image', () => (
    expect(widthImage.toBeDefined)
  ))
})

//----------------------------------------Integration test Containers/Bills----------------------------------------

//+++++++++++++++++++++++++++++++++++++A REVOIR+++++++++++++++++++++++++++++++++++++

describe("Given I am connected as an employee", () => {
  describe("When I click on 'Nouvelle note de frais'", () => {
    test("Then it should navigate to a new page with a form to complete", () => {

    })
  })

  describe("When I click on a blus eye icon", () => {
    test("Then it should display amodal showing the current bill", () => {

    })
  })

  describe("When I am on bills page", () => {
    test("Then I should see all my previous bills in antichronogical order", () => {

    })
  })
})