<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-21 16:34:38
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 19:23:26
 * @FilePath: /CasaOS-UI/src/components/AcquaintanceShare/modals/MyInfoModal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('My Share ID')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <b-field class="mb-3 mt-5 has-text-light"  expanded>
          <b-input :value="myID" icon-right="content-copy" icon-right-clickable @icon-right-click="copyMyId"></b-input>
        </b-field>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Close')" type="is-primary" rounded expaned @click="$emit('close')" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import copy from 'clipboard-copy'
export default {
  data() {
      return {
          myID: ""
      }
  },
  mounted () {
      this.getMyShareId()
  },
  methods: {
    //   Get MyID
    getMyShareId(){
        this.$api.person.getMyShareId().then(res=>{
            this.myID = res.data.data
        })
    },
    //   Copy MyID to clipboard
    copyMyId() {
      copy(this.myID)
      this.$buefy.toast.open({
        message: this.$t('Copied to clipboard'),
        type: 'is-success'
      })
    }
  },
}
</script>

<style>
</style>