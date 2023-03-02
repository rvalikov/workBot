import ExcelJS from "exceljs"

export async function readExcel(employee) {
  console.log ("employee", employee)
  const workbook = new ExcelJS.Workbook();
  let flag = false;

  return workbook.xlsx.readFile('./list_Komarova125.xlsx')
    .then(() => {
      console.log('Excel file read successfully.');

      const worksheet = workbook.getWorksheet('1677479');

      // const user = {
      //   firstName: textlist[0].toUpperCase(),
      //   lastName: textlist[1].toUpperCase(),
      //   department: textlist[2].toUpperCase(),
      //   phone: textlist[3],
      // }

      worksheet.eachRow((row, rowNumber) => {

        const rowValues = row.values;
       // console.log(rowValues)
        let usersfio= []
        let usertel=[]
        usersfio=rowValues[2].split(" ")
        if (rowValues[4]!=undefined){
          if (rowValues[3]!=undefined){
        usertel=usertel.concat(rowValues[3].split(","),rowValues[4].split(","))
        usertel=usertel.map(elem=>elem.slice(-10))}}
        else{if (rowValues[3]!=undefined){
          usertel=usertel.concat(rowValues[3].split(","))
          usertel=usertel.map(elem=>elem.slice(-10))}
          else{usertel="no number"}}
         console.log("usertel=", usertel)
        

        console.log("usertelslice=", usertel)
        console.log("employee.phone", employee.phone)
        console.log("employee.lastName", employee.lastName)
        console.log("employee.firstName", employee.firstName)
        console.log("employee.department", employee.department)
        if (usertel.includes(employee.phone)&&usersfio.includes(employee.lastName)&&usersfio.includes(employee.firstName)&&rowValues[1].toUpperCase()==employee.department) {
          flag = true;
          console.log("flag==",flag)
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