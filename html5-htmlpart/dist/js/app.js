angular.module("trainingCss",["sdco-slides"]).config(["slidesConfigProvider","$controllerProvider",function(n,i){n.applyConf(),angular.module("trainingCss").exoController=i.register}]).run(["slidesConfig",function(n){n.init()}]);