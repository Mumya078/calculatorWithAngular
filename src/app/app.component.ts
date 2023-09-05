import { Component,} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',]
})
export class AppComponent {
  isDarkMode = false;
  dataValues: string[] = [];
  operations: string[] = [];
  result:any;
  showingHistory = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
  getValue(event: any) {
    const divElement = event.currentTarget as HTMLDivElement;
    const dataValue = divElement.getAttribute('data-value');

    if (dataValue) {
      if (this.dataValues.length === 0 && this.isOperator(dataValue)) {
        // Dizi boşsa ve ilk eleman bir operatör ise, bir şey yapmayın.
        return;
      }

      if (this.isNumber(dataValue)) {
        // Rakam ise, mevcut verilere ekleyin veya yeni bir sayı olarak başlayın.
        if (this.dataValues.length > 0) {
          if (this.isNumber(this.dataValues[this.dataValues.length - 1]) || this.dataValues[this.dataValues.length - 1].includes('.')) {
            // Mevcut eleman bir rakam veya nokta içeriyorsa, yeni rakamı aynı elemanda ekleyin.
            this.dataValues[this.dataValues.length - 1] += dataValue;
          } else {
            // Mevcut eleman bir operatör ise, yeni bir sayı olarak başlayın.
            this.dataValues.push(dataValue);
          }
        } else {
          // Dizi boşsa ve rakam girildiyse, yeni bir sayı olarak başlayın.
          this.dataValues.push(dataValue);
        }
      } else if (this.isOperator(dataValue)) {
        // Operatör ise, direkt olarak diziye ekleyin.
        if (
          this.dataValues.length === 0 ||
          !this.isOperator(this.dataValues[this.dataValues.length - 1])
        ) {
          this.dataValues.push(dataValue);
        }
      } else if (dataValue === '=') {
        this.calculate();
      } else if (dataValue === '.') {
        // "." karakterini yeni bir sayı olarak kabul edin.
        if (
          this.dataValues.length === 0 ||
          !this.isNumber(this.dataValues[this.dataValues.length - 1])
        ) {
          this.dataValues.push('0' + dataValue); // Başlangıçta "0." olarak ekleyin
        } else if (!this.dataValues[this.dataValues.length - 1].includes('.')) {
          // Sayı zaten bir nokta içermiyorsa, noktayı ekleyin.
          this.dataValues[this.dataValues.length - 1] += dataValue;
        }
      }
      console.log('Clicked div with data-value:', dataValue);
      console.log('Updated dataValues array:', this.dataValues);
    }
  }

  toggleSignOfCurrentElement() {
    if (this.dataValues.length > 0) {
      const currentValue = this.dataValues[this.dataValues.length - 1];

      // Eğer değer pozitifse başına '-' ekleyin
      if (currentValue.charAt(0) !== '-') {
        this.dataValues[this.dataValues.length - 1] = '-' + currentValue;
      }
      // Eğer değer negatifse başındaki '-' işaretini kaldırın
      else {
        this.dataValues[this.dataValues.length - 1] = currentValue.slice(1);
      }
    }
  }


  isNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }
  isFraction(value: string): boolean {
    return /^\d+\.\d+$/.test(value); // Noktalı kesirli sayıyı tanımlayan regex
  }

  isOperator(value: string): boolean {
    return ['+', '-', '*', '/','%'].includes(value);
  }

  calculate() {
    if (this.dataValues.length === 0) {
      return;
    }

    const valuesCopy = [...this.dataValues];

    while (valuesCopy.length > 1) {
      const operatorIndex = valuesCopy.findIndex(this.isOperator);
      if (operatorIndex === -1) {
        break;
      }

      const num1 = parseFloat(valuesCopy[operatorIndex - 1]);
      const num2 = parseFloat(valuesCopy[operatorIndex + 1]);
      const operator = valuesCopy[operatorIndex];

      let result = 0;

      if (operator === '+') {
        result = num1 + num2;
      } else if (operator === '-') {
        result = num1 - num2;
      } else if (operator === '*') {
        result = num1 * num2;
      } else if (operator === '%') {
      result = num1 % num2; // Mod alma işlemi
    }
      else if (operator === '/') {
        if (num2 !== 0) {
          result = num1 / num2;
        } else {
          console.error('Bölme sıfıra bölünemez!');
          return;
        }


      }

      valuesCopy.splice(operatorIndex - 1, 3, result.toString());
    }

    const finalResult = valuesCopy[0];

    // Sonuç ve son 3 işlemi ve sonucu `operations` dizisine ekleyin
    if (this.operations.length >= 3) {
      this.operations.shift(); // Eski işlemi kaldır
    }

    this.operations.push(`${this.dataValues.join(' ')} = ${finalResult}`);
    this.result = finalResult;

    console.log('Sonuç:', finalResult);
    console.log('Son 3 İşlem ve Sonuç:', this.operations);
  }


  clear() {
    this.dataValues = [];
    this.result=0;
  }
  toggleHistory() {
    this.showingHistory = !this.showingHistory;
  }

}
