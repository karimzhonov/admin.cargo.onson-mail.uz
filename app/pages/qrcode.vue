<template>
  <WithNavbar>
    <div
      v-if="error"
      class="flex flex-col mt-3"
      style="align-items: center"
    >
      <qr
        :data="`https://admin.cargo.onson-mail.uz/${localPath('qrcode/')}`"
      />
      <p class="mt-3">
        {{ error }}
      </p>
    </div>

    <qrcode-stream
      v-else
      @detect="onDetect"
      @error="onError"
    />
    {{ data }}
  </WithNavbar>
</template>

<script lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'Qrcode',
  components: { QrcodeStream },
  data() {
    return {
      error: null,
      data: null
    }
  },
  methods: {
    localPath: useLocalePath(),
    onError(error: any) {
      this.error = error
    },
    onDetect(detectedCodes: any) {
      this.data = detectedCodes
    }
  }
}
</script>
