set VERSION=1.0.0
call jar cvf product-assistant-ui-%VERSION%.jar -C dist .
call mvn install:install-file -DgroupId=com.tuna -DartifactId=product-assistant-ui -Dversion=%VERSION% -Dpackaging=jar -Dfile=product-assistant-ui-%VERSION%.jar
call del product-assistant-ui-%VERSION%.jar
