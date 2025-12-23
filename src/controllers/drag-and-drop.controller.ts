
export class DragAndDropController {
  host

  private originalElement: HTMLElement | null = null

  private element: HTMLElement | null = null

  private siblingElement: HTMLElement | null = null

  private threshold: number = 80

  private dragSlop: number = 10

  private startX = 0

  private currentX = 0

  private dragging = false

  private isDraggingGesture = false

  private revealed = false

  private onReveal?: () => void

  private onReset?: () => void

  private onTrigger?: () => void

  /**
   * constructor - A constructor for initializing the host and adding the controller.
   *
   * @param { type } host - The host to be initialized.
   */
  constructor(host: any) {
    this.host = host
    this.host.addController(this)
  }

  /**
   * hostConnected - A function that runs when the host is connected.
   */
  hostConnected() {
    // Init dependencies if needed
  }

  /**
   * hostDisconnected - A function that runs when the host is disconnected.
   */
  hostDisconnected() {
    // Clear dependencies when needed
  }

  /**
   * Methods
   */
  onStart(event: MouseEvent | TouchEvent) {
    this.originalElement = event.currentTarget as HTMLElement

    this.dragging = true
    this.isDraggingGesture = false
    this.revealed = false

    this.startX = this.getClientX(event)

    const childDraggable = this.originalElement.querySelector('.is-draggable') as HTMLElement
    this.element = childDraggable || this.originalElement
    this.element.style.transition = 'none'
    this.element.style.flex = `1 0 ${this.element.offsetWidth}px`
    
    const siblingDraggable = this.originalElement.querySelector('.is-sibling-draggable') as HTMLElement
    if (siblingDraggable) {
      this.siblingElement = siblingDraggable
      this.siblingElement.style.transition = 'none'
    }
  }

  onMove(event: MouseEvent | TouchEvent) {
    if (!this.dragging || !this.element) return

    this.currentX = this.getClientX(event)
    const deltaX = this.currentX - this.startX

    // Aún no consideramos drag → no interferimos con el enlace
    if (!this.isDraggingGesture) {
      if (Math.abs(deltaX) < this.dragSlop) return

      // A partir de aquí ya es un drag real
      this.isDraggingGesture = true
    }

    // Solo queremos drag hacia la izquierda
    if (deltaX > 0) return

    // Ahora sí, cancelamos comportamiento nativo (scroll / click)
    event.preventDefault()

    this.element.style.transform = `translateX(${deltaX}px)`
    
    if (this.siblingElement) {
      this.siblingElement.style.flex = `1 0 ${deltaX * -1}px`
      this.siblingElement.style.transform = `translateX(${deltaX}px)`
    }

    if (Math.abs(deltaX) > this.threshold && !this.revealed) {
      this.revealed = true
      this.originalElement?.dispatchEvent(new CustomEvent('reveal', { detail: this.originalElement }))
    }
  }

  onEnd() {
    if (!this.dragging || !this.element) return

    this.dragging = false

    this.element.style.transition = 'transform 0.2s ease'

    if (this.siblingElement) {
      this.siblingElement.style.transition = `transform 0.2s ease`
    }

    // No hubo drag → dejamos que el enlace funcione
    if (!this.isDraggingGesture) {
      this._resetInternalState()
      return
    }

    if (this.revealed) {
      this.element.style.transform = `translateX(-${this.threshold}px)`
      
      if (this.siblingElement) {
        this.siblingElement.style.flex = `1 0 ${this.threshold}px`
        this.siblingElement.style.transform = `translateX(-${this.threshold}px)`
      }

      this.originalElement?.dispatchEvent(new CustomEvent('trigger', { detail: this.originalElement }))
    } else {
      this.reset()
    }
  }

  reset() {
    if (!this.element) return

    this.element.style.transition = 'transform 0.2s ease'
    this.element.style.transform = 'translateX(0)'
    
    if (this.siblingElement) {
      this.siblingElement.style.transition = 'transform 0.2s ease'
      this.siblingElement.style.flex = '1 0 0'
      this.siblingElement.style.transform = 'translateX(0)'
    }

    this.element.dispatchEvent(new CustomEvent('reset', { detail: this.originalElement }))
    this._resetInternalState()
  }

  private _resetInternalState() {
    this.revealed = false
    this.isDraggingGesture = false
    this.element = null
    this.siblingElement = null
    this.originalElement = null
  }

  getClientX(event: MouseEvent | TouchEvent) {
    return 'touches' in event
      ? event.touches[0].clientX
      : event.clientX
  }
}
