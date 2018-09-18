function removeClassFromClass(groupClass,badClass) {
  var things = document.querySelectorAll("." + groupClass);
  for(i=0;i<things.length;i++) {
    things[i].classList.remove(badClass);
  }
}
module.exports=removeClassFromClass;
