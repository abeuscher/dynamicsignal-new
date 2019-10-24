function removeClassFromCollection(className,els) {
  for(i=0;i<els.length;i++) {
    els[i].classList.remove(className);
  }
}
module.exports=removeClassFromCollection;
