import ExcelJS from "exceljs"

export function readExcel(employee) {
  const workbook = new ExcelJS.Workbook();
  let flag = false;

  return workbook.xlsx.readFile('./list_excel.xlsx')
    .then(() => {
      console.log('Excel file read successfully.');

      const worksheet = workbook.getWorksheet('Лист1');
      // const user = {
      //   firstName: textlist[0].toUpperCase(),
      //   lastName: textlist[1].toUpperCase(),
      //   department: textlist[2].toUpperCase(),
      //   phone: textlist[3],
      // }

      worksheet.eachRow((row, rowNumber) => {
        const rowValues = row.values;
console.log("Проверка")
        if (rowValues[1].toUpperCase() == employee.firstName &&
            rowValues[2].toUpperCase() == employee.lastName &&
            rowValues[3].toUpperCase() == employee.department &&
            rowValues[4] == employee.phone) {
          flag = true;
        }
      });

      if (flag) {
        
        console.log(`Пользователь ${employee.lastName} найден в таблице Excel!`);
      } else {
        console.log(`Пользователь ${employee.lastName} не найден в таблице Excel.`);
      }
      
      return flag;
    })
    .catch((error) => {
      console.log(`Ошибка при чтении Excel-файла: ${error}`);
      return false;
    });
}