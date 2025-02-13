<template>
  <WithNavbar>
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
    </div>

    <div class="flex justify-center">
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
          <i style="font-size: 30px" class="i-heroicons-check-circle-16-solid text-green-500"></i>
        </div>

        <div
          v-else-if="validationFailure"
          class="validation-failure"
        >
          <i style="font-size: 30px" class="i-heroicons-check-circle-16-solid text-red-500"></i>
        </div>

        <div
          v-else-if="validationPending"
          class="validation-pending"
        >
          <i style="font-size: 30px" class="i-heroicons-check-circle-16-solid text-green-500"></i>
        </div>
        <div
          v-else
          class="screen"
        >
          <div></div>
        </div>
      </qrcode-stream>
    </div>
    {{ data }}
  </WithNavbar>
</template>

<script lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'Qrcode',
  components: { QrcodeStream },
  data() {
    console.log(useLocalePath())
    return {
      paused: false,
      error: null,
      data: null,
      isValid: undefined
    }
  },
  computed: {
    validationPending() {
      return this.isValid === undefined && this.paused
    },

    validationSuccess() {
      return this.isValid === true
    },

    validationFailure() {
      return this.isValid === false
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

      // pretend it's taking really long
      await this.timeout(1000)
      this.isValid = this.data.startsWith('https://onson-mail.uz/qrcode/?order_id=')

      // some more delay, so users have time to read the message
      await this.timeout(1000)
      this.paused = false
    }
  }
}
</script>

<style>
.qrcode-stream {
  width: 80%!important;
  aspect-ratio: 1/1;
}

.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  filter: blur(0.5);
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  color: black;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
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
  border: 2px solid rgb(34 197 94 / var(--un-text-opacity));
  border-radius: 5px;
}
</style>
