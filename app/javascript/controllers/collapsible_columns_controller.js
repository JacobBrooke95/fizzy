import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = [ "collapsed" ]
  static targets = [ "column", "button" ]

  toggle({ target }) {
    const clickedColumn = target.closest('[data-collapsible-columns-target="column"]')

    if (!clickedColumn) return
    this.#expandOnly(clickedColumn);
  }

  preventToggle(event) {
    if (event.detail.attributeName === "class") {
      event.preventDefault()
    }
  }

  #expandOnly(clickedColumn) {
    this.#collapseAllExcept(clickedColumn);
    this.#expand(clickedColumn)
  }

  #collapseAllExcept(clickedColumn) {
    this.columnTargets.forEach(column => {
      if (column !== clickedColumn) {
        this.#collapse(column)
      }
    })
  }

  #collapse(column) {
    this.#buttonFor(column).setAttribute("aria-expanded", "false")
    column.classList.add(this.collapsedClass)
  }

  #expand(column) {
    this.#buttonFor(column).setAttribute("aria-expanded", "true")
    column.classList.remove(this.collapsedClass)
  }

  #buttonFor(column) {
    return this.buttonTargets.find(button => column.contains(button))
  }
}
