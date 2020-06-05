new Vue({
    el: '#app',
    data: function () {
      return {
        options: {
          afterLoad: this.afterLoad,
          navigation: true,
          anchors: ['page1', 'page2', 'page3'],
          sectionsColor: ['#5C6EDA', '#ff5f45', '#0798ec', '#fec401', '#1bcee6', '#ee1a59', '#2c3e4f', '#ba5be9', '#b4b8ab'] } };
  
    },
    methods: {
      afterLoad: function (origin, destination, direction) {
        console.log("After load....");
        console.log(destination);
      },
      addSection: function (e) {
        var newSectionNumber = document.querySelectorAll('.fp-section').length + 1;
  
        var section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = `<h3>Section ${newSectionNumber}</h3>`;
  
        document.querySelector('#fullpage').appendChild(section);
  
        var sectionMenuItem = document.createElement('li');
        sectionMenuItem.setAttribute('data-menuanchor', 'page' + newSectionNumber);
        sectionMenuItem.innerHTML = `<a href="#page${newSectionNumber}">Section${newSectionNumber}</a>`;
  
        this.options.anchors.push(`page${newSectionNumber}`);
        this.$refs.fullpage.build();
      },
  
      removeSection: function () {
        var sections = document.querySelector('#fullpage').querySelectorAll('.fp-section');
        var lastSection = sections[sections.length - 1];
  
        lastSection.parentNode.removeChild(lastSection);
  
        this.options.anchors.pop();
  
        var sectionsMenuItems = document.querySelectorAll('#menu li');
        var lastItem = sectionsMenuItems[sectionsMenuItems.length - 1];
        lastItem.parentNode.removeChild(lastItem);
      } 
    } 
});

