<template>
  <div class="container">
    <h1>Management</h1>
    <div v-if="!loading">
      <b-button variant="primary" class="action-banks" @click="$bvModal.show(`createBank`)">
        <b-icon icon="plus"></b-icon> Create new bank
      </b-button>
      <div v-for="(bank, index) in banks" :key="bank._id" style="margin: 0.5em">
        <b-card :title="bank.name">
          <b-card-text>{{bank._id}}</b-card-text>
          <b-card-text> Loan term: {{bank.loanTerm}} months. </b-card-text>
          <b-card-text> Max loan: {{bank.maxLoan}}$ </b-card-text>
          <b-card-text> Min payment: {{bank.minPayment}}$ </b-card-text>
          <b-card-text> Interest rate: {{bank.interestRate}}$ </b-card-text>
          <b-button variant="warning" class="action-banks" @click="$bvModal.show('edit-'+bank._id)">Edit</b-button>
          <b-button variant="danger" class="action-banks" @click="$bvModal.show('remove-'+bank._id)">Remove</b-button>

          <b-modal :id="'edit-'+bank._id" :title="bank.name" data-edit-modal scrollable>
            <b-form id="form-edit-bank">
<!--              <b-form-input :id="'name-'+bank._id" type="text" :value="bank._id"/>-->
              <b-form-group :id="'input-name-group-'+index"
                            label="Bank name:" :label-for="'name-'+bank._id">
                <b-form-input :id="'name-'+bank._id" type="text" class="edit-bank-input"
                              placeholder="Enter Bank name" required
                              :value="bank.name"
                ></b-form-input>

              </b-form-group>

              <b-form-group :id="'input-max-loan-group-'+index"
                            label="Max loan($):" :label-for="'maxLoan-'+bank._id">
                <b-form-input :id="'maxLoan-'+bank._id" type="number" class="edit-bank-input"
                              placeholder="Enter max loan" required
                              :value="bank.maxLoan"
                ></b-form-input>
              </b-form-group>

              <b-form-group :id="'input-min-payment-group-'+index"
                            label="Min payment($):" :label-for="'minPayment-'+bank._id">
                <b-form-input :id="'minPayment-'+bank._id" type="number" class="edit-bank-input"
                              placeholder="Enter min payment" required
                              :value="bank.minPayment"
                ></b-form-input>
              </b-form-group>

              <b-form-group :id="'input-loan-term-group-'+index"
                            label="Loan term(months):" :label-for="'loanTerm-'+bank._id">
                <b-form-input :id="'loanTerm-'+bank._id" type="number" class="edit-bank-input"
                              placeholder="Enter loan term" required
                              :value="bank.loanTerm"
                ></b-form-input>
              </b-form-group>

              <b-form-group :id="'input-interest-rate-group-'+index"
                            label="Interest rate(%):" :label-for="'interestRate-'+bank._id">
                <b-form-input :id="'interestRate-'+bank._id" type="number" class="edit-bank-input"
                              placeholder="Enter interest rate" required
                              :value="bank.interestRate"
                ></b-form-input>
              </b-form-group>

            </b-form>
            <template #modal-footer="{ ok, cancel }">
              <!--            bank.name,bank.maxLoan,bank.minPayment,bank.loanTerm,bank.interestRate-->
              <b-button variant="success"
                        @click="updateBank('edit-'+bank._id, bank._id,'name-'+bank._id,'maxLoan-'+bank._id,
                      'minPayment-'+bank._id,'loanTerm-'+bank._id,'interestRate-'+bank._id)">
                Сохранить</b-button>
              <b-button variant="danger" @click="cancel()"> Отмена </b-button>
            </template>
          </b-modal>
          <b-modal :id="'remove-'+bank._id" :title="bank.name">
            <h4>Вы точно хотите удалить {{bank.name}}?</h4>
            <template #modal-footer="{ ok, cancel }">
              <b-button variant="success" v-on:click="$bvModal.hide('remove-'+bank._id)"
                        @click="removeBank(bank.name)"> Да </b-button>
              <b-button variant="danger" @click="cancel()"> Нет </b-button>
            </template>
          </b-modal>
        </b-card>
      </div>
      <b-modal id="createBank" title="New bank">
        <b-form @submit.stop.prevent>
          <b-form-group id="input-name-group"
                        label="Bank name:" label-for="createBankName">
            <b-form-input id="createBankName" type="text" required :state="validationBankName"
                          v-model="newBankName" :value="newBankName"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-max-loan-group"
                        label="Max loan($):" label-for="createBankMaxLoan">
            <b-form-input id="createBankMaxLoan" type="number" required :state="validationBankMaxLoan"
                          v-model="newBankMaxLoan" :value="newBankMaxLoan"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-max-loan-group"
                        label="Min payment($):" label-for="createBankMinPayment">
            <b-form-input id="createBankMinPayment" type="number" required :state="validationBankMinPayment"
                          v-model="newBankMinPayment" :value="newBankMinPayment"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-max-loan-group"
                        label="Loan term(months):" label-for="createBankLoanTerm">
            <b-form-input id="createBankLoanTerm" type="number" required :state="validationBankLoanTerm"
                          v-model="newBankLoanTerm" :value="newBankLoanTerm"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-max-loan-group"
                        label="Interest rate(%):" label-for="createBankInterestRate">
            <b-form-input id="createBankInterestRate" type="number" required :state="validationBankInterestRate"
                          v-model="newBankInterestRate" :value="newBankInterestRate"
            ></b-form-input>
          </b-form-group>

        </b-form>
        <template #modal-footer="{ ok, cancel }">
          <b-button variant="success"
                    @click="createBank()"> Создать </b-button>
          <b-button variant="danger" @click="cancel()"> Отмена </b-button>
        </template>
      </b-modal>
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
  name: "Management",
  data() {
    return {
      server: `https://server-elif-tech.herokuapp.com`,
      loading: false,
      banks: [],
      newBankName: '',
      newBankMaxLoan: '',
      newBankMinPayment: '',
      newBankLoanTerm: '',
      newBankInterestRate: ''
    }
  },
  computed: {
    validationBankName() {
      return this.newBankName.length >= 3
    },
    validationBankLoanTerm() {
      return this.newBankLoanTerm.length > 0
    },
    validationBankMinPayment() {
      return this.newBankMinPayment.length > 2
    },
    validationBankMaxLoan() {
      return this.newBankMaxLoan.length > 4
    },
    validationBankInterestRate() {
      return this.newBankInterestRate.length > 0
    }
  },
  methods: {
    async getBanks(){
      try {
        this.loading = true;
        const response = await axios.get(`${this.server}/getBanks`)
        this.banks = response.data
        // console.log(this.banks)
      } catch(e) {
        console.log(e, ' error')
      } finally {
        this.loading = false;
      }
    },
    async removeBank(bank) {
      try {
        this.loading = true;
        const response = await axios.post(`${this.server}/removeBank`,
            {'name':bank})
        await this.getBanks()
      } catch(e) {
        console.log(e, ' error')
      } finally {
        this.loading = false;
      }
    },
    async createBank() {
      try {
        this.loading = true;
        const response = await axios.post(`${this.server}/createBank`,
            {"name" : this.newBankName,
                  "maxLoan" : this.newBankMaxLoan,
                  "minPayment" : this.newBankMinPayment,
                  "loanTerm" : this.newBankLoanTerm,
                  "interestRate" : this.newBankInterestRate})
        this.$bvModal.hide('createBank');
        await this.getBanks()
        // this.banks = response.data
        // console.log(response)
      } catch(e) {
        console.log(e, ' error')
      } finally {
        this.loading = false;
      }
    },
    async updateBank(modalId,_id,name,maxLoan,minPayment,loanTerm,interestRate) {
      try {
        this.loading = true;
        const response = await axios.post(`${this.server}/updateBank`,
            {"_id": _id,
                "name" : document.getElementById(name).value,
                "maxLoan" : document.getElementById(maxLoan).value,
                "minPayment" : document.getElementById(minPayment).value,
                "loanTerm" : document.getElementById(loanTerm).value,
                "interestRate" : document.getElementById(interestRate).value})
        this.$bvModal.hide(modalId);
        await this.getBanks()
        // this.banks = response.data
        // console.log(response)
      } catch(e) {
        console.log(e, ' error')
      } finally {
        this.loading = false;
      }
    }
  },
  beforeMount() {
    this.getBanks();
  }
}
</script>

<style  lang="scss">
.action-banks {
  margin: 0.5em;
}
.modal-header .close {
  padding: 1rem;
  margin: -1rem -1rem -1rem auto;
}
button.close {
  padding: 0;
  background-color: transparent;
  border: 0;
}
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .5;
}
.close:hover {
  color: #000;
  text-decoration: none;
}
</style>