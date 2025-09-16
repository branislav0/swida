# Playwright E2E Tests – Transportly (Stage)

End-to-end tests validating the **“Create Transport Request”** flow against the stage environment.  
The suite focuses on **happy paths**, meaningful **negative validations**, and **resilience/usability checks**.  
Dynamic test data is generated to keep test runs isolated and repeatable.

---

## Technology Stack

- Playwright Test (TypeScript)  
- Page Object Model (POM) for maintainability  
- Environment-driven configuration (`process.env`)  
- Stage base URL: `https://stage.4shipper.transportly.eu`

---

## Project Structure

- `tests/` – all E2E spec files  
- `pom/` – Page Object Models encapsulating locators and actions  
- `utils/` – helper functions (e.g., dynamic test data, date helpers)  
- `.env` – environment variables 

---

## Test Coverage

### Happy Path
Full end-to-end **Transport Request creation**:

1. Select pickup type  
2. Provide pickup time window and location  
3. Provide delivery details  
4. Select carrier  
5. Review and send  
6. Verify the created request appears in the Request List

### Negative Scenarios

- **Required fields**  
  - Attempt to continue without filling mandatory pickup fields shows validation errors (note: only 4/6 required field errors currently appear).  

- **Invalid inputs**  
  - Registration: invalid email and phone validations are exercised.

### Resilience / Usability

- **Double-click prevention**  
  - Verifies that double-clicking **“Send request”** currently allows multiple submissions (known UX bug).  

- **Button state**  
  - Registration submit button may remain enabled even when form is invalid (known UX issue).  

---

## Known Issues Observed on Stage

1. Only 4/6 required pickup field errors appear when continuing without all fields filled  
2. Double-click on **“Send request”** allows duplicate submission  
3. Submit button on registration sometimes remains enabled even when the form is invalid  
4. Invalid phone format on registration is not always validated consistently  

---

## Setup

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
npx playwright install
npx playwright test --headed

for debug : 
npx playwright test --headed --debug
