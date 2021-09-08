<template>
  <div class="container">
    <h1>Calculator</h1>
    <div v-if="!loading">

      <div class="container" >
        <b-form-select v-model="selectedBank" :options="banks" @change="changeBank()"></b-form-select>
        <p>
          <span>Обязательный платеж</span>
          <span> {{minPayment}}</span>
        </p>

        <label for="initialLoan">Сумма кредита {{loan}}$
        </label>
        <b-form-input id="initialLoan" v-model="loan" type="range" style="width: 100%"
                      :min="minRange" :max="maxRange" :step="stepRange"
        ></b-form-input>

        <b-button variant="outline-primary" style="margin: 0.5em" @click="calculate">Расчитать</b-button>
      </div>
      <div class="row" v-if="this.tableItems.length > 0">
          <p>Ежемесячный платеж: {{this.tableItems[0]['Total payment']}}$</p>
          <p>Начисленные проценты {{this.tableItems[0]['Sum']}}%</p>
          <p>Долг + проценты {{+this.selectedLoan + +this.tableItems[0]['Sum']}}$</p>
      </div>
      <div class="row" v-if="tableItems.length > 0">
        <b-table id="mortgageTable" responsive="sm" :fields="tableFields" :items="tableItems" >
          <template #cell(Month)="data">
            {{ data.index + 1 }}
          </template>
        </b-table>
      </div>
    </div>
    <div v-else>
      <b-button variant="primary" disabled>
        <b-spinner small type="grow"></b-spinner>
        Загрузка...
      </b-button>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "Calculator",
  components: {},
  data() {
    return {
      server: `https://server-elif-tech.herokuapp.com`,
      loading: false,
      banks: [],
      selectedBank: 0,
      loan: 0,
      selectedLoan: 0,
      minPayment: 0,
      minRange: 0,
      maxRange: 0,
      stepRange: 0,
      tableFields: ['Month','Total payment','Interest payment','Loan balance','Equity'],
      tableItems: [],
    }
  },
  methods: {
    changeBank() {
      this.tableItems.length = 0;
      this.tableItems = []
      this.loan = this.banks[this.selectedBank].minPayment * 2
      this.minPayment = this.banks[this.selectedBank].minPayment
      this.minRange = this.banks[this.selectedBank].minPayment * 2
      this.maxRange = this.banks[this.selectedBank].maxLoan
      this.stepRange = this.banks[this.selectedBank].minPayment / 4
    },
    async getBanks(){
      try {
        this.loading = true;
        const response = await axios.get(`${this.server}/getBanks`)
        this.loan = response.data[this.selectedBank].minPayment * 2
        this.minPayment = response.data[this.selectedBank].minPayment
        this.minRange = response.data[this.selectedBank].minPayment * 2
        this.maxRange = response.data[this.selectedBank].maxLoan
        this.stepRange = response.data[this.selectedBank].minPayment / 4

        for(let i = 0; i < response.data.length; i++) {
          this.banks.push({
            value: i,
            text: response.data[i].name,
            minPayment: response.data[i].minPayment,
            maxLoan: response.data[i].maxLoan,
            loanTerm: response.data[i].loanTerm
          })
        }
      } catch(e) {
        console.log(e, ' error')
      } finally {
        this.loading = false;
      }
    },
    async calculate() {
      try {
        this.loading = true;
        const response = await axios.post(`${this.server}/calculate`,
            {'name': this.banks[this.selectedBank].text, 'loan': this.loan})
        this.selectedLoan = this.loan;
        this.tableItems.length = 0;
        for(let i = 0; i < response.data.term; i++ ) {
          this.tableItems.push({
            'Total payment': response.data.totalPaymentsArr[i],
            'Interest payment':response.data.interestPaymentArr[i],
            'Loan balance':response.data.loanBalanceArr[i],
            'Equity':response.data.equityArr[i],
            'Sum': response.data.sumLoanBalance
          })
        }
      } catch (e) {
        console.log(e)
      }  finally {
        this.loading = false;
      }
    }
  },

  beforeMount() {
    this.getBanks();
  }
}
</script>

<style >
.custom-control-label:before,
.custom-file-label,
.custom-select {
  transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.custom-select {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  padding: .375rem 1.75rem .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  vertical-align: middle;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
select {
  word-wrap: normal;
}
.custom-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
}
</style>