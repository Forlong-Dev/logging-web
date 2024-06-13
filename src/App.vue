<template>
  <main>
    <div class="container-fluid">
      <b-modal v-model="modalShow" size="xl">
        <div class="box">
          <div>Request</div>
          <JsonViewer
            name="request"
            :value="modalData.request"
            :previewMode="false"
            :expanded="true"
            :expandDepth="2"
            copyable
            theme="light"
            sort
          />

          <div>Response</div>
          <JsonViewer
            name="response"
            :value="modalData.response"
            :previewMode="false"
            :expanded="true"
            :expandDepth="2"
            copyable
            theme="dark"
            sort
          />
        </div>
      </b-modal>

      <b-form @submit="loadData">
        <b-row>
          <b-col>
            <b-form-group id="input-group-3" label="Site:" label-for="input-5">
              <b-form-select
                id="input-5"
                v-model="form.site"
                :options="sites"
                :fixed="true"
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="fieldset-1" label-for="input-1" label="Key: ">
              <b-form-input id="input-1" v-model="form.key" trim></b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group id="fieldset-2" label-for="input-2" label="URL: ">
              <b-form-input id="input-2" v-model="form.url" trim></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group id="fieldset-3" label-for="input-3" label="Limit: ">
              <b-form-input
                id="input-3"
                v-model="form.limit"
                type="number"
                trim
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              id="fieldset-4"
              label-for="input-4"
              label="Session ID: "
            >
              <b-form-input
                id="input-4"
                v-model="form.sessionId"
                trim
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <div>Choose a date</div>
          <VueDatePicker
            id="datePicker"
            v-model="form.date"
            range
            locale="kr"
          />
        </b-row>

        <b-row style="margin: 10px">
          <b-col>
            <b-button
              type="submit"
              variant="primary"
              style="width: 100%"
              :disabled="loading"
            >
              Submit
            </b-button>
          </b-col>
          <b-col>
            <b-button @click="reset()" variant="danger" style="width: 100%">
              Reset
            </b-button>
          </b-col>
        </b-row>
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
            <th scope="col">SESSION ID</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item._id"
            :class="item.status !== '200' ? 'table-danger' : ''"
          >
            <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
            <td>{{ item.method }}</td>
            <td>{{ item.url }}</td>
            <td>{{ item.status }}</td>
            <td>
              <a
                @click="
                  this.form.key = item.key;
                  loadData();
                "
                >{{ item.key }}</a
              >
            </td>
            <td style="font-size: 12px">
              <a
                @click="
                  this.form.sessionId = item.sessionId;
                  loadData();
                "
              >
                {{ item.sessionId }}
              </a>
            </td>
            <td>
              <button @click="fModalShow(item._id)" class="btn btn-secondary">
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

import "vue-json-pretty/lib/styles.css";

export default {
  setup() {},
  components: {
    VueDatePicker,
    JsonViewer,
  },
  created() {
    this.reset();
    this.loadSite();
    this.loadData();

    // 10초마다 loadData
    setInterval(() => {
      this.loadData();
    }, 10000);
  },
  methods: {
    loadData: async function () {
      if (this.loading) return;

      this.loading = true;
      axios
        .post("/api/load", this.form)
        .then((response) => {
          this.items = response.data;
        })
        .catch(() => {
          console.log("error");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadSite: async function () {
      axios
        .post("/api/site")
        .then((response) => {
          this.sites = response.data;
        })
        .catch(() => {
          console.log("error");
        });
    },

    loadDetail: async function (id) {
      return await axios.post("/api/load/" + id);
    },

    reset: function () {
      this.form = {
        site: "crm-prod",
        key: "",
        url: "",
        limit: 100,
        sessionId: "",
      };

      this.loadData();
    },

    fModalShow: async function (item) {
      this.modalShow = true;
      this.modalData = {};
      const response = await this.loadDetail(item);
      const data = response.data;

      try {
        this.modalData.response = JSON.parse(data.response);
      } catch (e) {
        this.modalData.response = data.response;
      }

      try {
        this.modalData.request = JSON.parse(data.request);
      } catch (e) {
        this.modalData.request = data.request;
      }
    },
  },
  data() {
    return {
      loading: false,
      sites: ["crm-prod"],
      modalShow: false,
      modalData: {
        response: {},
        request: {},
      },

      items: [],

      form: {},
    };
  },
};
</script>
