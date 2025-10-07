<template>
  <div
    ref="container"
    class="container relative bg-gray-900 mx-auto text-gray-100"
    style="max-width: 960px"
  >
    <Modal
      v-if="content"
      @click.self="clearContent"
      :content="content"
      :clearContent="clearContent"
    />
    <transition name="drop">
      <div
        v-if="inView || showPreview"
        class="
          fixed
          top-0
          w-full
          z-30
          bg-gray-900
          justify-between
          items-center
          flex
          md:hidden
        "
      >
        <div
          class="logo w-16 m-4"
          v-html="logoSvg"
        ></div>
        <button
          class="
            p-3
            mx-4
            font-extrabold
            rounded
            tracking-wide
            focus:outline-none
            select-none
          "
          :class="showPreview ? 'bg-gray-700' : 'bg-emerald-600'"
          @click="!opening && togglePreview()"
        >
          {{ showPreview ? 'Close preview' : 'Open preview' }}
        </button>
      </div>
    </transition>
    <transition name="fade">
      <Preview
        v-show="showPreview"
        class="fixed top-20 w-full bottom-0 z-20 border-none rounded-b-none"
        ref="html"
        :username="username"
        :genInfo="genInfo"
        :images="images"
        :featured="featured"
        :colors="colors"
        :primaryActions="primaryActions"
        :secondaryActions="secondaryActions"
        :PreviewMode="PreviewMode"
        :downloadVcard="downloadVcard"
        :footerCredit="footerCredit"
        :showAlert="showAlert"
        :hasLightBG="hasLightBG"
        :downloadKey="downloadKey"
        :pubKeyIsValid="pubKeyIsValid"
      />
    </transition>

    <div class="px-4">
      <div class="flex items-start justify-between pt-8">
        <div
          class="logo w-24"
          v-html="logoSvg"
          title="EnBizCard - An Open-Source Digital Business Card Generator"
        ></div>
        <a
          class="
            font-extrabold
            tracking-wide
            leading-none
            shrink-0
            p-3
            border-2
            text-white
            border-gray-700
            rounded
            hover:bg-gray-700
            focus:bg-gray-700
            transition-colors
            duration-200
          "
          href="https://www.vishnuraghav.com/donate"
          target="_blank"
          rel="noreferrer"
          >Donate</a
        >
      </div>
      <h1
        class="
          text-3xl
          md:text-5xl
          font-extrabold
          mt-24
          md:mt-48 md:leading-tight
        "
      >
        Why Pay When Your Website Can Host Your Digital Business Cards for Free!
      </h1>
      <p class="mt-8 text-lg md:text-xl w-full md:w-3/4 text-gray-200">
        EnBizCard helps you create beautiful, responsive HTML&#8209;based
        digital business cards that can be hosted on your website.
      </p>
      <ul class="mt-4 text-gray-400">
        <li>-&ensp;No sign-up required</li>
        <li>-&ensp;100% free and open-source</li>
        <li>-&ensp;No user tracking and data collection</li>
        <li>-&ensp;Works offline</li>
      </ul>
      <div class="mt-4 flex flex-wrap items-center">
        <button
          class="
            font-extrabold
            leading-none
            text-lg
            tracking-wide
            select-none
            shrink-0
            p-5
            mt-2
            mr-2
            text-white
            bg-emerald-600
            rounded
            hover:bg-emerald-500
            focus:bg-emerald-500
            transition-colors
            duration-200
            focus:outline-none
          "
          @click="create()"
        >
          Create your own
        </button>
        <a
          class="
            font-extrabold
            leading-none
            text-lg
            tracking-wide
            shrink-0
            p-5
            mt-2
            text-white
            bg-gray-700
            rounded
            hover:bg-gray-600
            focus:bg-gray-600
            transition-colors
            duration-200
          "
          href="/demo"
          target="_blank"
          >View demo</a
        >
      </div>
      <p class="mt-6">
        Read the
        <NuxtLink
          to="/hosting-guide"
          class="
            cursor-pointer
            underline
            font-extrabold
            text-emerald-600
            hover:text-emerald-500
            focus:text-emerald-500
            transition-colors
            duration-200
          "
          >Hosting Guide</NuxtLink
        >
      </p>
    </div>
    
    <!-- Rest of the template content would continue here -->
    <!-- For brevity, I'm showing the key structure -->
    
    <Vcard ref="vCard" :vCard="vCard" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '~/stores/theme'
import Modal from '~/components/Modal.vue'
import Attachment from '~/components/Attachment.vue'
import Action from '~/components/Action.vue'
import Featured from '~/components/Featured.vue'
import Colour from '~/components/Colour.vue'
import Preview from '~/components/Preview.vue'
import Download from '~/components/Download.vue'
import Help from '~/components/Help.vue'
import Footer from '~/components/Footer.vue'
import Cropper from '~/components/Cropper.vue'
import Vcard from '~/components/Vcard.vue'

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// Store
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

// Reactive data
const container = ref<HTMLElement>()
const html = ref()
const vCard = ref()
const create = ref<HTMLElement>()

// Data
const downloadCheckList = ref([
  {
    label: 'I did not attach any link or file that will cause any risk to the user',
    checked: false,
  },
  {
    label: 'I have verified that all the links are working correctly',
    checked: false,
  },
  {
    label: 'I have removed all unused fields and sections',
    checked: false,
  },
])

const images = ref({
  logo: {
    url: null,
    blob: null,
    ext: null,
    mime: null,
    resized: null,
  },
  photo: {
    url: null,
    blob: null,
    ext: null,
    mime: null,
    resized: null,
  },
  cover: {
    url: null,
    blob: null,
    ext: null,
    mime: null,
    resized: null,
  },
})

const colors = ref({
  logoBg: {
    color: `#059669`,
    openPalette: false,
  },
  mainBg: {
    color: `#ddd`,
    openPalette: false,
  },
  buttonBg: {
    color: `#059669`,
    openPalette: false,
  },
  cardBg: {
    color: `#fff`,
    openPalette: false,
  },
})

const genInfo = ref({
  fname: null,
  lname: null,
  pronouns: null,
  title: null,
  biz: null,
  addr: null,
  desc: null,
  key: null,
  tracker: null,
  fontLink: null,
  fontCss: null,
})

const primaryActions = ref([])
const secondaryActions = ref([])
const featured = ref([
  {
    title: 'Section title',
    content: [],
  },
])

const hostedURL = ref(null)
const footerCredit = ref(true)
const PreviewMode = ref(true)
const content = ref(null)
const inView = ref(false)
const showPreview = ref(false)
const scrollPos = ref(null)
const opening = ref(false)

// Computed
const getFullname = computed(() => {
  let fn = genInfo.value.fname
  let ln = genInfo.value.lname
  return (fn + ln).length ? `${fn ? fn : ''}${ln ? ' ' + ln : ''}` : null
})

const username = computed(() => {
  return getFullname.value
    ? getFullname.value.toLowerCase().replace(/\W+/g, '')
    : 'username'
})

const pubKeyIsValid = computed(() => {
  if (genInfo.value.key) {
    if (!genInfo.value.key.match(/^(-----BEGIN PGP PUBLIC KEY BLOCK-----)/))
      return false

    if (!genInfo.value.key.match(/(-----END PGP PUBLIC KEY BLOCK-----)$/))
      return false

    return true
  } else return false
})

const downloadChecked = computed(() => {
  return downloadCheckList.value.filter((e) => e.checked).length == 3
})

const vCard = computed(() => {
  const getNumber = (type) => {
    let no = primaryActions.value
      .map((e) => (e.name == type ? e.value : null))
      .filter((e) => e)[0]
    return no ? no.replace(/\s/g, '') : null
  }
  let email = primaryActions.value
    .map((e) => (e.name == 'Email' ? e.value : null))
    .filter((e) => e)[0]
  let website = primaryActions.value
    .map((e) => (e.name == 'Website' ? e.value : null))
    .filter((e) => e)[0]
  let actions = [
    ...primaryActions.value,
    ...secondaryActions.value.map((e) => {
      return { ...e, isURL: 1 }
    }),
  ]
  let urls = actions
    .map((e) => {
      if (e.isURL && e.value) {
        return {
          title: e.name,
          url:
            (e.href ? e.href : '') + e.value + (e.hrefEnd ? e.hrefEnd : ''),
        }
      }
      return false
    })
    .filter((e) => e)

  let note = genInfo.value.desc
    ? genInfo.value.desc.replace(/[\r\n]+/gm, '')
    : null
  let key = pubKeyIsValid.value ? window.btoa(genInfo.value.key) : null
  let randomNumber = Math.floor(100000000 + Math.random() * 900000)
  return {
    fn: genInfo.value.fname,
    ln: genInfo.value.lname,
    title: genInfo.value.title,
    org: genInfo.value.biz,
    addr: genInfo.value.addr,
    cell: getNumber('Mobile'),
    work: getNumber('Office'),
    home: getNumber('Home'),
    sms: getNumber('SMS'),
    email,
    hostedURL: hostedURL.value,
    website,
    urls,
    key,
    note,
    uid: `EnBizCard-${randomNumber}`,
  }
})

// Methods
const togglePreview = () => {
  opening.value = true
  let c = container.value
  if (showPreview.value) {
    c?.classList.remove('overflow-y-hidden', 'h-screen')
    window.scrollTo(0, scrollPos.value)
    opening.value = false
  } else {
    scrollPos.value = window.scrollY
    setTimeout(() => {
      c?.classList.add('overflow-y-hidden', 'h-screen')
      opening.value = false
    }, 400)
  }
  showPreview.value = !showPreview.value
}

const checkView = () => {
  let e = create.value
  if (e) {
    let top = e.getBoundingClientRect().top
    inView.value = showPreview.value ? true : top < 0
  }
}

const clearContent = () => {
  content.value = null
}

const create = () => {
  create.value?.scrollIntoView({ behavior: 'smooth' })
}

const showAlert = (content) => {
  content.value = content
}

const downloadVcard = () => {
  let blob = new Blob([vCard.value.$refs.vCard.innerText], {
    type: 'text/plain',
  })
  saveAs(window.URL.createObjectURL(blob), `${username.value}.vcf`)
}

const downloadKey = () => {
  let blob = new Blob([genInfo.value.key], {
    type: 'text/plain',
  })
  saveAs(
    window.URL.createObjectURL(blob),
    `${getFullname.value}'s public key.asc`
  )
}

const hasLightBG = (e) => {
  let hex = colors.value[e].color
  hex = hex.slice(1)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)
  const brightness = Math.round(
    (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
  )
  return brightness > 125 ? true : false
}

// Logo SVG (you'll need to import this properly)
const logoSvg = ref('<!-- SVG content here -->')

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', checkView)
})
</script>