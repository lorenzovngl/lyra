# 🌌 Lyra - Budget Tracking Web App in React

This is a web application developed in React that allows you to keep track of your financial movements.

## 🛠️ Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/lorenzovngl/lyra.git
```

### 2. Change the working directory

```bash
cd lyra
```

### 3. Install dependencies

```bash
npm install
```

### 4. Insert data
Create a folder `data` under `/src`. Then create two files in that folder:

- `incomes.csv` in which you place your incomes;
- `expenses.csv` in which you place your expenses.

To allow Lyra to process the files mentioned above, these files must respect the following notation for each row (the first row is the header):

1. **Date**: _String_ in format "YYYY-MM-DD";
2. **Label**: _String_;
3. **Amount**: _Number_ with decimal separator `.` (point);
4. **Tags**: _String_ represent the category of that movement;
5. **Notes**: _String_, optional.

**Important notices**:

- Values for expenses must be positive numbers.
- All the values must be separated by a comma.

### 5. Run the app

```bash
npm start
```
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 6. Build the app

```bash
npm run build
```

Builds the app for production to the `build` folder.