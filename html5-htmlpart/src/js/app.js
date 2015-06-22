angular.module('trainingCss', ['sdco-slides'])
//Config routes
.config(['slidesConfigProvider', '$controllerProvider',
  function(slidesConfigProvider, $controllerProvider){
    slidesConfigProvider.applyConf();

    //angular.module('trainingAJ').controllerProvider= $controllerProvider;
    angular.module('trainingCss').exoController= $controllerProvider.register;
}])
//Init view classes
.run(['slidesConfig',  function(slidesConfig){
  slidesConfig.init();
}]);
