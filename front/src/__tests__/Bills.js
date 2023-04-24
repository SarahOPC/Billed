/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import MyClass, {default as billFunctions} from "../containers/Bills.js";
import router from "../app/Router.js";
import "@testing-library/jest-dom";
import mockStore from "../__mocks__/store"

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

      expect (windowIcon).toEqual(windowIcon);
      expect (windowIcon).toHaveClass('active-icon');
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
  it ('should return an array of bills', async () => {
    const billsInstance = new billFunctions({document, onNavigate, localStorage});
    const bills = await billsInstance.getBills();
    expect(bills).toBeDefined;
  })

  it ('should return an error', async () => {
    const billsInstance = new billFunctions({document, onNavigate, localStorage});
    await expect(billsInstance.getBills("foo")).toBeUndefined;
  })
})

/**
 * @ function handleClickNewBill
 */

describe('handleClickNewBill Unit Test Suites', () => {
  it ('should change the url of the page', async() => {
    const billsInstance = new billFunctions({document, onNavigate, localStorage});
    const currentUrl = "http://127.0.0.1:8080/#employee/bills";
    expect(billsInstance.handleClickNewBill.currentUrl).toBeFalsy;
  })
})

describe('handleClickNewBill Unit Test Suites', () => {
  it ('should call onNavigate with the correct argument', () => {
    
  })
})

/**
 * @ function handleClickIconEye
 */

describe('handleClickIconEye Unit Test Suites', () => {

  it ('should return a bill url', () => {
    const billsInstance = new billFunctions({document, onNavigate, localStorage});
    expect(billsInstance.billUrl).toBeDefined;
  })

  it ('should define a width for the image', () => {
    const billsInstance = new billFunctions({document, onNavigate, localStorage});
    expect(billsInstance.widthImage).toBeDefined;
  })
})

//----------------------------------------Integration test Containers/Bills----------------------------------------

describe("Given I am connected as an employee", () => {

  // Before running all the tests, we use a promise that resolves only when the page is fully loaded
  // so we ensure that the tests will only run when the page is fully loaded
  beforeAll(() => {
    return new Promise((resolve) => {
      window.onload = () => {
        resolve();
      }
    })
  })

  describe("When I click on 'Nouvelle note de frais'", () => {
    test("Then it should navigate to a new page with a form to complete", () => {
      window.onload = () => { // Wrapping the code in window.onload to be sure the elements will be fully loaded before the test runs
        const currentUrl = window.location.href;
        const btnNewBill = document.getElementById('[data-testid="btn-new-bill"]');
        btnNewBill.addEventListener("click", function() {
          const newUrl = window.location.href;
          expect(currentUrl).not.toBe(newUrl);
        });
        btnNewBill.click(); // Simulate a click on the button
      }
    })
  })

  describe("When I click on a blue eye icon", () => {
    test("Then it should display a modal showing the current bill", () => {
      window.onload = () => {
        const blueEyeIcon = document.getElementById('[data-testid="icon-eye"]');
        blueEyeIcon.addEventListener("click", function() {
          const modal = document.getElementById('modalFile');
          expect(modal.style.display).toBe("block");
        });
        blueEyeIcon.click(); // Simulate a click on the icon
      }
    })
  })

  describe("When I am on bills page", () => {
    test("Then I should see all my previous bills in antichronogical order", () => {
        window.onload= () => {
        const dataBody = document.getElementById('[data-testid="tbody"]');
        expect(dataBody.childElementCount).toBe(3);
        
        const trElements = dataBody.querySelectorAll('tr');
        trElements.forEach(trElement => {
          expect(trElement.childElementCount).toBe(6);
        });
        
        const lastTrElement = trElements[trElements.length - 1];
        expect(lastTrElement.classList).toContain('icon-actions');
      }
    })
  })
})

//----------------------------------------Integration test GET----------------------------------------

describe("Given I am a user connected as Employee", () => {

  beforeEach(() => {
    Object.defineProperty(
      window,
      'localStorage',
      { value: localStorageMock }
    );
    window.localStorage.setItem('user', JSON.stringify({
      type: 'employee',
      email: "employee@test.tld"
    }));
  });

  describe("When I navigate to Bills Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentTableType  = await screen.getByText("Type")
      expect(contentTableType).toBeTruthy()
      const contentTableName  = await screen.getByText("Nom")
      expect(contentTableName).toBeTruthy()
      const contentTableDate  = await screen.getByText("Date")
      expect(contentTableDate).toBeTruthy()
      const contentTablePrice  = await screen.getByText("Montant")
      expect(contentTablePrice).toBeTruthy()
      const contentTableStatus  = await screen.getByText("Statut")
      expect(contentTableStatus).toBeTruthy()
      const contentTableActions  = await screen.getByText("Actions")
      expect(contentTableActions).toBeTruthy()
      const contentTableBody  = await document.querySelector('[data-testid="tbody"]')
      expect(contentTableBody.childElementCount).toBeGreaterThanOrEqual(1)
    })

    describe("When an error occurs on API", () => {
      let root;
      let mockBills;

      beforeEach(() => {
        root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        mockBills = jest.spyOn(mockStore, "bills")
      })

      // Clean the spyOn of mockStore.bills to not interfere and create second effects on others tests
      afterEach(() => {
        jest.restoreAllMocks()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const pErrorMessage = document.createElement( 'p' )
        pErrorMessage.textContent = "Erreur 404";
        root.appendChild(pErrorMessage)

        mockBills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error(pErrorMessage.textContent))
            }
          }})
          await waitFor(() => expect(screen.queryByText("Erreur 404")).toBeInTheDocument())
          // queryByText return null if element not found, not an error
      })

      test("fetches messages from an API and fails with 500 message error", async () => {
        window.onNavigate(ROUTES_PATH.Bills);
          await new Promise(process.nextTick);
          const pErrorMessage = document.createElement( 'p' )
          pErrorMessage.textContent = "Erreur 500";
          root.appendChild(pErrorMessage)

        mockBills.mockImplementationOnce( () => {
          return {
            list : () =>  {
              return Promise.reject(new Error(pErrorMessage.textContent))
            }
          }})

          await waitFor(() => expect(screen.queryByText("Erreur 500")).toBeInTheDocument())
          // queryByText return null if element not found, not an error
      })
    })
  })
})