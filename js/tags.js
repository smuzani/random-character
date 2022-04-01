'use strict';

/* global logout:true, showModal: true, 
hideModal: true, showError: true, handleParseError:true */

const TagGroup = Parse.Object.extend('TagGroup');
const Tag = Parse.Object.extend('Tag');

const vm = new Vue({
  el: '#app',
  data: function() {
    return {
      item: {uid: '', name: '', desc: '', edit: false},
      group: {current: '', new: ''},
      items: [],
      groups: []
    };
  },
  methods:{
    addItem() {
      const itemTag = new Tag();
      const tagGroup = new TagGroup();
      tagGroup.id = vm.group.current;
      itemTag.set('name', vm.item.name);
      itemTag.set('desc', vm.item.desc);
      itemTag.set('group', tagGroup);
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(Parse.User.current(), true);
      itemTag.setACL(acl);
      vm.item = [];
      showModal('Saving', '', true);
      itemTag.save()
      .then((tag) => {
        hideModal();
         vm.items.push({
          uid:tag.id, 
          name:tag.get('name'), 
          desc:tag.get('desc'),
          edit: false});
        $('#form-name').focus();
      }, (error) => {
        hideModal();
        showError(error);
        handleParseError(error);
      });
    },
    addTagGroup() {
      const tagGroup = new TagGroup();
      const user = Parse.User.current();
      tagGroup.set('name', vm.group.new);
      tagGroup.relation('owners').add(user);
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(Parse.User.current(), true);
      tagGroup.setACL(acl);
      vm.group.new = '';
      showModal('Saving', '', true);
      tagGroup.save()
      .then((group) => {
        hideModal();
        loadTagGroups();
      }, (error) => {
        hideModal();
        showError(error);
        handleParseError(error);
      });
    },
    updateItem(index) {
      vm.items[index].edit = !vm.items[index].edit;
      if (!vm.items[index].edit){
        const itemTag = new Tag();
        showModal('Updating', '', true);
        itemTag.id = vm.items[index].uid;
        itemTag.set('name', vm.items[index].name);
        itemTag.set('desc', vm.items[index].desc);
        itemTag.save().then((itemTag) => {
          // jshint unused:false
          hideModal();
        }, (error) => {
          hideModal();
          showError(error);
          handleParseError(error);
        });
      }
    },
    removeItem(index) {
      const itemTag = new Tag();
      showModal('Deleting', '', true);
      itemTag.id = vm.items[index].uid;
      itemTag.destroy().then((itemTag) => {
        // jshint unused:false
        let tag = this.items.splice(index, 1);
        hideModal();
      }, (error) => {
        hideModal();
        showError(error);
        handleParseError(error);
      });
    },
    parseToTag(results) {
      results.forEach((tag) => {
        this.items.push({
          uid:tag.id,
          name:tag.get('name'), 
          desc:tag.get('desc'),
          edit:false});
      });
    },
    parseToGroups(results) {
      results.forEach((group) => {
        this.groups.push({
          uid:group.id,
          name:group.get('name')});
      });
    }
  }
});

$(document).ready(function() {
  const user = Parse.User.current();
  if (user){
    loadTagGroups();
  } else {
    logout();
  }
});

function loadTagGroups(){
  const user = Parse.User.current();
  const query = new Parse.Query(TagGroup);
  showModal('Loading', '', true);
  query.equalTo('owners', user);
  query.find()
  .then((results) => {
    hideModal();
    vm.parseToGroups(results);
  }, (error) => {
    hideModal();
    showError(error);
    handleParseError(error);
  });
}

function loadTags(){
  const query = new Parse.Query(Tag);
  const pointer = { "__type": "Pointer", "className": "TagGroup", 
    "objectId": vm.group.current }
  query.equalTo('group', pointer);
  showModal('Loading', '', true);
  query.find()
  .then((results) => {
    hideModal();
    vm.parseToTag(results);
    $('#data-entry').removeAttr('hidden');
    $('#crud').removeAttr('hidden');
    console.log('results: ' + results.length);
  }, (error) => {
    hideModal();
    showError(error);
    handleParseError(error);
  });
}

$('#tag-group').on('change', () =>{
  loadTags();
});