<template>
  <main>
    <div class="container-fluid">
      <b-modal v-model="modalShow" size="xl">
        <div class="box">
          <label for="request">Request</label>
          <JsonViewer
            name="request"
            :value="modalData.request"
            :previewMode="true"
            copyable
            theme="light"
          />

          <label for="response">Response</label>
          <JsonViewer
            name="response"
            :value="modalData.response"
            :previewMode="true"
            theme="dark"
          />
        </div>
      </b-modal>

      <b-form @submit="loadData" @reset="reset">
        <b-form-group id="input-group-3" label="Site:" label-for="input-3">
          <b-form-select
            id="input-3"
            v-model="form.site"
            :options="sites"
            :fixed="true"
            @input="onChange()"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group id="fieldset-1" label-for="input-1" label="Key: ">
          <b-form-input
            id="input-1"
            v-model="form.key"
            @input="onChange()"
            trim
          ></b-form-input>
        </b-form-group>

        <b-form-group id="fieldset-2" label-for="input-2" label="URL: ">
          <b-form-input
            id="input-2"
            v-model="form.url"
            @input="onChange()"
            trim
          ></b-form-input>
        </b-form-group>

        <b-form-group id="fieldset-3" label-for="input-3" label="Limit: ">
          <b-form-input
            id="input-3"
            v-model="form.limit"
            @input="onChange()"
            trim
          ></b-form-input>
        </b-form-group>

        <label for="example-datepicker">Choose a date</label>
        <VueDatePicker v-model="form.date" range locale="kr" />

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>

      <!-- <b-table striped hover :items="items"></b-table> -->

      <table class="table table-striped" style="width: 100%">
        <thead class="thead-dark">
          <tr>
            <th scope="col">시간</th>
            <th scope="col">Method</th>
            <th scope="col">Url</th>
            <th scope="col">Status</th>
            <th scope="col">Key</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item._id"
            :class="item.status !== '200' ? 'table-danger' : ''"
          >
            <td>{{ item.timestamp }}</td>
            <td>{{ item.method }}</td>
            <td>{{ item.url }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.key }}</td>
            <td>
              <button @click="fModalShow(item)" class="btn btn-secondary">
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { JsonViewer } from "vue3-json-viewer";

export default {
  setup() {},
  components: {
    VueDatePicker,
  },
  created() {
    this.loadData();

    // 5초마다 데이터를 가져옴
    setInterval(() => {
      this.loadData();
    }, 5000);
  },
  methods: {
    onChange() {
      this.loadData();
    },
    loadData: async function () {
      axios
        .post("/api/load", this.form)
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].timestamp = new Date(
              response.data[i].timestamp
            ).toLocaleString();
          }
          this.items = response.data;
        })
        .catch(() => {
          console.log("error");
        });
    },

    reset: function () {
      this.form = {
        site: "crm-prod",
        key: "",
        url: "",
        limit: 100,
      };
    },

    fModalShow: function (item) {
      this.modalShow = true;
      this.modalData = {};

      try {
        this.modalData.response = JSON.parse(item.response);
      } catch (e) {
        this.modalData.response = item.response;
      }

      try {
        this.modalData.request = JSON.parse(item.request);
      } catch (e) {
        this.modalData.request = item.request;
      }
    },
  },
  data() {
    return {
      sites: ["crm-prod", "kizumi-admin", "kizumi-ex", "kizumi-wallet"],
      modalShow: false,
      modalData: {},

      items: [],

      form: {
        site: "crm-prod",
        key: "",
        url: "",
        limit: 100,
      },
    };
  },
};
</script>
