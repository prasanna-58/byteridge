<template>
  <div id="app">
    <div class="app-right-section">
      <div class="mailsend-ext-main">
        <b-card-body class="p-0">
          <b-card-header class="align-items-center p-3 headersec border-0">
            <h4 class="card-header-title w-25">
              <img src="../assets/minds/logo-icon.png" width="36" />
            </h4>
            <p class="text-dark w-75 supportingline text-center mb-0">
              Audit roles
            </p>
          </b-card-header>
        </b-card-body>
        <hr style="width: 90%; margin: 0 auto" />
        <AuditRole></AuditRole>
      </div>
    </div>
  </div>
</template>

<script>
import AuditRole from "./AuditRole";
export default {
  data() {
    return {};
  },
  components: {
    AuditRole,
  },
};
</script>

<style lang="css" scoped>
.trytext {
  font-size: 10px;
}
</style>
