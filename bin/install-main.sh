set VERSION=1.0.0
pnpm run build-only
cd ..
jar cvf cloud-platform-ui-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.tuna -DartifactId=cloud-platform-ui -Dversion=$VERSION -Dpackaging=jar -Dfile=cloud-platform-ui-$VERSION.jar
rm -f cloud-platform-ui-$VERSION.jar
