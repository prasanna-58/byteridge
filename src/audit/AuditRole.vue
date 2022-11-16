<template>
  <div>
    <b-container fluid class="">
      <b-row>
        <b-col lg="12" class="">
          <div class="header-body topstrip d-flex align-items-center justify-content-between border-bottom-0">
            <template>
              <date-picker
                v-model="range"
                type="date"
                singleDatePicker="true"
                placeholder="Select date range"
                :disabled-date="disabledBeforeTodayAndAfterAWeek"
                @change="onChangeDate($event)"
              ></date-picker>
            </template>
          </div>
        </b-col>
        <b-col lg="12" class="">
          <div v-if="githubRepos">
            <div>
              <b-card class="m-3">
                <b-table
                  id="my-table"
                  responsive
                  :busy.sync="isBusy"
                  :items="myProvider"
                  :per-page="perPage"
                  :fields="Lists"
                  :current-page="currentPage"
                  small
                  class="text-nowrap"
                  @row-clicked="myRowClickHandler"
                  lazy
                >
                  <template #cell(id)="data">
                    <div id="id">
                      <p>{{ data.value }}</p>
                    </div>
                  </template>
                  <template #cell(username)="data">
                    <div id="username">
                      <p class="mb-1 ellipsis" v-b-popover.hover.top="data.value.length > 26 ? data.value.length : ''">
                        {{ data.value }}
                      </p>
                    </div>
                  </template>
                  <template #cell(firstName)="data">
                    <p class="mb-1 ellipsis" id="firstName" v-b-popover.hover.top="data.value.length > 26 ? data.value : ''">
                      {{ data.value }}
                    </p>
                  </template>
                  <template #cell(lastName)="data">
                    <p class="mb-1 ellipsis" id="lastName" style="cursor: pointer" v-b-popover.hover.top="data.value.length > 26 ? data.value : ''">
                      {{ data.value }}
                    </p>
                  </template>
                  <template #cell(role)="data">
                    <div>
                      <p class="mb-1 ellipsis" id="role">
                        {{ data.value }}
                      </p>
                    </div>
                  </template>
                  <template #cell(createdDate)="data">
                    <div>
                      <p class="mb-1 ellipsis" id="role">
                        {{ data.value }}
                      </p>
                    </div>
                  </template>
                </b-table>
              </b-card>
            </div>
            <div class="mb-4" v-if="count > 25">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                align="right"
                class="mb-0 justify-content-center trackresponse-pagination"
              ></b-pagination>
            </div>
            <div v-if="items.length == 0">
              <div class="bg-white mx-auto pb-3 text-center">
                <!-- <img src="../assets/minds/loading.gif" class="img-fluid mt-5 mx-auto pt-5" /> -->
              </div>
            </div>
          </div>
          <div v-else>
            <div class="bg-white mx-auto pb-3 text-center">
              <!-- <img src="../assets/minds/drips.svg" width="190px" class="img-fluid mt-5 mx-auto pt-4" /> -->
              <h5 class="d-block text-black-50 mt-4">No data found under the last 30 days</h5>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-sidebar id="sidebar-1" title="Sidebar" right shadow>
        <div class="px-3 py-2">
          <p>{{ details }}</p>
          <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
        </div>
      </b-sidebar>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "AuditRole",
  components: { "date-picker": DatePicker },

  data() {
    return {
      isBusy: false,
      currentPage: 1,
      perPage: 30,
      githubRepos: true,
      items: [],
      offset: 0,
      page: 0,
      range: "",
      count: 0,
      Lists: [
        {
          key: "createdDate",
          label: "CreatedDate",
        },
        {
          key: "firstName",
          label: "FirstName",
        },
        {
          key: "lastName",
          label: "LastName",
        },
        {
          key: "username",
          label: "Username",
        },
        {
          key: "role",
          label: "role",
        },
        {
          key: "id",
          label: "id",
        },
      ],
      details: {},
    };
  },
  computed: {
    rows: function() {
      return this.count;
    },
  },
  mounted() {
    var currentDate = new Date();
    var currentWeekDay = currentDate.getDay();
    var lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
    var ws = new Date(new Date(currentDate).setDate(currentDate.getDate() - lessDays));
    var we = new Date(new Date(ws).setDate(ws.getDate() + 6));
    this.defaultWeekStart = this.calendarFormat(ws);
    this.defaultWeekEnd = this.calendarFormat(we);
    this.weekStart = this.dbFormat(ws);
    this.weekEnd = this.dbFormat(we);
    this.range1 = [
      new Date(parseInt(this.defaultWeekStart.split("-")[0]), parseInt(this.defaultWeekStart.split("-")[1]), parseInt(this.defaultWeekStart.split("-")[2])),
      new Date(parseInt(this.defaultWeekEnd.split("-")[0]), parseInt(this.defaultWeekEnd.split("-")[1]), parseInt(this.defaultWeekEnd.split("-")[2])),
    ];
  },
  methods: {
    // Disable future dates
    disabledBeforeTodayAndAfterAWeek(date) {
      return date > new Date(parseInt(this.defaultWeekEnd.split("-")[0]), parseInt(this.defaultWeekEnd.split("-")[1]), parseInt(this.defaultWeekEnd.split("-")[2]));
    },
    // List the event while change the calendar
    onChangeDate(date) {
      var fromDate = new Date(date[0]); // Current date of week
      this.weekStart = this.dbToCalendarFormat(fromDate);
      var EndDate = new Date(date[1]); // Current date of week
      this.weekEnd = this.dbToCalendarFormat(EndDate);
      this.myProvider(window.ctx, window.callback);
    },
    // Get the email by respective user
    myProvider(ctx, callback) {
      window.ctx = ctx;
      window.callback = callback;
      this.isBusy = true;
      if (this.page > ctx.currentPage) this.offset = this.offset - ctx.perPage * (this.page - ctx.currentPage);
      else {
        this.page = ctx.currentPage;
        this.offset = ctx.perPage * (ctx.currentPage - 1);
      }

      this.getURL(ctx.currentPage)
        .then(response => {
          // Pluck the array of items off our axios response
          if (response.data.length) {
            this.count = response.data.length * 3;
            this.githubRepos = true;
            this.items = [];
            this.page = ctx.currentPage;
            response.data.forEach(repos => {
              var repoInfo = {};
              repoInfo.createdDate = repos.createdDate;
              repoInfo.firstName = repos.firstName;
              repoInfo.id = repos.id;
              repoInfo.lastName = repos.lastName;
              repoInfo.role = repos.role;
              repoInfo.username = repos.username;
              this.items.push(repoInfo);
            });
            this.isBusy = false;
            callback(this.items);
          } else {
            this.githubRepos = false;
          }
          // Provide the array of items to the callback
        })
        .catch(() => {
          this.isBusy = false;
          // eslint-disable-next-line standard/no-callback-literal
          callback([]);
        });

      // Must return null or undefined to signal b-table that callback is being used
      return null;
    },

    /**
     * Its redirected open with new tab
     * @param {String} value Its github repo link
     */
    openLink(value) {
      window.open(value, "_blank");
    },

    myRowClickHandler(record, index, event) {
      this.details = record;
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      console.log(event, "myRowClickHandler----->", record); // This will be the item data for the row
    },

    // Get relative path with respective app
    getAppDomain(page) {
      return `https://demo-api-master.byteridge.com/users`;
    },

    // Make axios request & get the data
    getURL: function(page) {
      var user = localStorage.getItem("user");
      return axios
        .get(this.getAppDomain(page), {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${JSON.parse(user).token}`,
          },
          withCredentials: false,
        })
        .then(response => response);
    },
    // Modify the Date based on calendar
    calendarFormat(date) {
      var dateFormat = date.getFullYear() + "-" + (date.getMonth() >= 9 ? date.getMonth() : "0" + date.getMonth()) + "-" + date.getDate();
      return dateFormat;
    },

    // Modify the Date based on DB
    dbFormat(date) {
      var dateFormat = date.getFullYear() + "-" + (date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + date.getDate();
      return dateFormat;
    },

    // Modify the date from calendar format to DB
    dbToCalendarFormat(date) {
      return (
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() >= 9 ? new Date(date).getMonth() + 1 : "0" + (new Date(date).getMonth() + 1)) +
        "-" +
        (new Date(date).getDate(date) >= 10 ? new Date(date).getDate() : "0" + new Date(date).getDate())
      );
    },
  },
};
</script>
