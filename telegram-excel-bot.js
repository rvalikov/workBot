import ExcelJS from "exceljs"

export function readExcel(textlist) {
  const workbook = new ExcelJS.Workbook();
  let flag = false;

  return workbook.xlsx.readFile('./list_excel.xlsx')
    .then(() => {
      console.log('Excel file read successfully.');

      const worksheet = workbook.getWorksheet('Лист1');
      const user = {
        firstName: textlist[0].toUpperCase(),
        lastName: textlist[1].toUpperCase(),
        department: textlist[2].toUpperCase(),
        phone: textlist[3],
      }

      worksheet.eachRow((row, rowNumber) => {
        const rowValues = row.values;

        if (rowValues[1].toUpperCase() == user.firstName &&
            rowValues[2].toUpperCase() == user.lastName &&
            rowValues[3].toUpperCase() == user.department &&
            rowValues[4] == user.phone) {
          flag = true;
        }
      });

      if (flag) {
        console.log(`Пользователь ${user.lastName} найден в таблице Excel!`);
      } else {
        console.log('Пользователь не найден в таблице Excel.');
      }

      return flag;
    })
    .catch((error) => {
      console.log(`Ошибка при чтении Excel-файла: ${error}`);
      return false;
    });
}