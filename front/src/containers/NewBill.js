import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  //----------------------------------------Correction bug #3 by checking extensions----------------------------------------
  
  displayErrorMessage() {
    const divModal = document.createElement( 'div' );
    divModal.setAttribute("class", "modalError");
    divModal.setAttribute("id", "myModal");
    const divContent = document.createElement( 'div' );
    divContent.setAttribute("class", "modal-content");
    const closeModal = document.createElement( 'img' );
    closeModal.setAttribute("class", "closeModal");
    closeModal.setAttribute("src", "https://img.icons8.com/pulsar-line/48/000000/cancel.png");
    closeModal.setAttribute("alt", "closeButton");
    closeModal.addEventListener('click', function() {
      divModal.style.display = 'none';
      const form = document.querySelectorAll(".form-control.blue-border")[7];
      form.value = '';
    });
    const pModal = document.createElement( 'p' );
    pModal.textContent = "Vous devez obligatoirement founir une fichier avec l'une des extensions suivantes : .png, .jpg ou .jpeg";
    divContent.appendChild(closeModal);
    divContent.appendChild(pModal);
    divModal.appendChild(divContent);
    const container = document.querySelector(".content");
    container.appendChild(divModal);
  }

  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const fileExtension = file.name.split(".")[1];
    if(fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
      this.displayErrorMessage();
      return;
    }
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => {
        console.log(fileUrl)
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      }).catch(error => console.error(error))
  }
  
  handleSubmit = e => {
    e.preventDefault()
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}