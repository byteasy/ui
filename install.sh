set VERSION=1.0.0
jar cvf product-assistant-ui-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.tuna -DartifactId=product-assistant-ui -Dversion=$VERSION -Dpackaging=jar -Dfile=product-assistant-ui-$VERSION.jar
rm -f product-assistant-ui-$VERSION.jar
