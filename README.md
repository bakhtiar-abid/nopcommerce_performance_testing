# JMeter Performance Testing Demo

This project demonstrates the use of Apache JMeter to perform performance testing on the nopCommerce platform. The testing scenarios cover various user actions to ensure the robustness and efficiency of the platform under different loads.

## Project Description

The project focuses on the following performance testing scenarios for the nopCommerce platform, with threads distributed by percentage:

1. **Guest User Browsing** (30%): Simulates a guest user navigating and browsing the test site.
2. **User Registration** (20%): Tests the process of a new user registering on the site.
3. **User Login** (20%): Simulates an existing user logging into their account.
4. **Adding Products to Cart** (20%): Tests the functionality of adding products to the user's shopping cart.
5. **Placing an Order** (10%): Simulates the process of placing an order by a logged-in user.

To maintain test data efficiently, a CSV file is used. This ensures that the data is organized, easily manageable, and can be dynamically loaded during the test execution.

## Table of Contents

- [Scenarios](#scenarios)
- [Contributing](#contributing)
- [License](#license)

## Scenarios

### Scenario 01: Guest User Browsing

- Simulates a guest user visiting the homepage, browsing categories, and viewing product details.
- [View Report](https://relaxed-bavarois-586ee0.netlify.app/)

### Scenario 02: User Registration

- Tests the registration process, including form submission and email verification.
- [View Report](https://kaleidoscopic-elf-a9f00c.netlify.app/)

### Scenario 03: User Login

- Simulates a user logging in with valid credentials.
- [View Report](https://singular-puffpuff-8df074.netlify.app/)

### Scenario 04: Adding Products to Cart

- Tests the functionality of adding various products to the shopping cart.
- [View Report](https://idyllic-banoffee-f60d4e.netlify.app/)

### Scenario 05: Placing an Order

- Simulates the complete checkout process, including payment and order confirmation.
- [View Report](https://spectacular-platypus-bf5ef2.netlify.app/)


## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
