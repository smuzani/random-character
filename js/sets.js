'use strict';

const Setting = Parse.Object.extend('CharSetting');

const vm = new Vue({
  el: '#app',
  data: function() {
    return {
      item: {uid: '', name: '', type:'', owners: [], edit: false},
      items: []
    };
  },
  methods:{
    addItem() {
      const itemSetting = new Setting();
      itemSetting.set('name', vm.item.name);
      itemSetting.set('type', vm.item.type);
      itemSetting.set('owners', vm.item.owners);
      vm.item = [];
      showModal('Saving', '', true);
      itemSetting.save()
      .then((Setting) => {
        hideModal();
         vm.items.push({
          uid:Setting.id, 
          name:Setting.get('name'), 
          desc:Setting.get('desc'),
          edit: false});
        $('#form-name').focus();
      }, (error) => {
        hideModal();
        showError(error);
        handleParseError(error);
      });
    },
    // updateItem(index) {
    //   vm.items[index].edit = !vm.items[index].edit;
    //   if (!vm.items[index].edit){
    //     const itemSetting = new Setting();
    //     showModal('Updating', '', true);
    //     itemSetting.id = vm.items[index].uid;
    //     itemSetting.set('name', vm.items[index].name);
    //     itemSetting.set('desc', vm.items[index].desc);
    //     itemSetting.save().then((itemSetting) => {
    //       // jshint unused:false
    //       hideModal();
    //     }, (error) => {
    //       hideModal();
    //       showError(error);
    //       handleParseError(error);
    //     });
    //   }

    // },
    // removeItem(index) {
    //   const itemSetting = new Setting();
    //   showModal('Deleting', '', true);
    //   itemSetting.id = vm.items[index].uid;
    //   itemSetting.destroy().then((itemSetting) => {
    //     // jshint unused:false
    //     let Setting = this.items.splice(index, 1);
    //     hideModal();
    //   }, (error) => {
    //     hideModal();
    //     showError(error);
    //     handleParseError(error);
    //   });
    // },
    parseToSetting(results) {
      results.forEach((Setting) => {
        this.items.push({
          uid:Setting.id,
          name:Setting.get('name'), 
          type:Setting.get('type'),
          owners:Setting.get('owners'),
          edit:false});
      });
      console.log(vm.items)
    }
  }
});

$(document).ready(function() {
  let user = Parse.User.current();
  if (user){
    loadSettings();
  } else {
    logout();
  }
});

function loadSettings(){
  const query = new Parse.Query(Setting);
  showModal('Loading', '', true);
  query.find()
  .then((results) => {
    hideModal();
    vm.parseToSetting(results);
  }, (error) => {
    hideModal();
    showError(error);
    handleParseError(error);
  });
}

