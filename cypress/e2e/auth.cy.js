describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@email.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="error-message"]').should('be.visible')
  })

  it('should successfully login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/dashboard')
  })
}) 