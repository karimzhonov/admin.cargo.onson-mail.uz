<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title="$t('Инвойси')"
      >
        <template #right>
          <USelectMenu
            v-model="st"
            :options="Object.keys(statuses)"
          >
            <template #label>
              {{ statuses[st].name }}
            </template>
            <template #option="{ option }">
              {{ statuses[option].name }}
            </template>
          </USelectMenu>
        </template>
        <template
          #toggle
        >
          <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
        </template>
      </UDashboardNavbar>
      <div
        v-if="error"
        class="flex flex-col mt-3"
        style="align-items: center"
      >
        <qr
          :data="`https://admin.cargo.onson-mail.uz${localPath('/qrcode/')}`"
        />
        <p class="mt-3">
          {{ error }}
        </p>
        <u-button
          label="test"
          @click="send_qr_data('5ba96345-818b-402f-a1a4-b425871a7f14')"
        />
      </div>

      <div
        v-else
        class="flex justify-center mt-3 border-r-4"
      >
        <qrcode-stream
          :paused="paused"
          class="qrcode-stream"
          @detect="onDetect"
          @error="onError"
        >
          <div
            v-if="validationSuccess"
            class="validation-success"
          >
            <UIcon
              name="i-heroicons-check-circle-16-solid"
              class="w-20 h-20 text-green-500"
            />
          </div>

          <div
            v-else-if="validationFailure"
            class="validation-failure"
          >
            <UIcon
              name="i-heroicons-x-circle-16-solid"
              class="w-20 h-20 text-red-500"
            />
          </div>

          <div
            v-else-if="validationPending"
            class="validation-pending"
          />
          <div
            v-else
            class="screen"
          >
            <div />
          </div>
        </qrcode-stream>
      </div>
      <div class="overflow-y-scroll">
        <OrderForm
          v-if="order"
          :initial="order"
          :disabled="true"
          class="m-3"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'Qrcode',
  components: { QrcodeStream },
  data() {
    return {
      st: 'create_time',
      paused: false,
      error: null,
      data: null,
      order: null,
      isValid: undefined
    }
  },
  computed: {
    validationPending() {
      return this.isValid === undefined && this.paused
    },

    validationSuccess() {
      return this.isValid === true && this.paused
    },

    validationFailure() {
      return this.isValid === false && this.paused
    }
  },
  methods: {
    localPath: useLocalePath(),
    onError(error: any) {
      this.error = error
    },
    timeout(ms: any) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
      })
    },
    async onDetect([firstDetectedCode]) {
      this.data = firstDetectedCode.rawValue
      this.paused = true
      this.isValid = undefined

      // pretend it's taking really long
      await this.timeout(500)
      this.isValid = this.data.startsWith('https://onson-mail.uz/qrcode/?order_id=')
      const url = new URL(this.data)
      await this.send_qr_data(url.searchParams.get('order_id'))
      // some more delay, so users have time to read the message
      await this.timeout(1000)
      this.paused = false
    },
    async send_qr_data(order_id: any) {
      try {
        const { data } = await this.$api(`cargo/order/admin/order/${order_id}/change_status/`, {
          method: 'PATCH',
          body: { status: this.st }
        })
        this.order = data.value
      } catch {
        this.order = null
      }
    }
  }
}
</script>

<style>
.qrcode-stream {
  width: 80% !important;
  aspect-ratio: 1/1;
}

.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.6);
  filter: blur(0.5);
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  color: black;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.screen {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: transparent;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  color: black;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.screen > div {
  width: 60%;
  height: 60%;
  border: 4px solid green;
  border-radius: 5px;
}
</style>
