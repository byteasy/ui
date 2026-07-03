. /etc/profile
VERSION=1.0.0
echo $VERSION
pnpm install
pnpm run build-only
jar cvf cloud-platform-ui-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.byteasy -DartifactId=cloud-platform-ui -Dversion=$VERSION -Dpackaging=jar -Dfile=cloud-platform-ui-$VERSION.jar
rm -f cloud-platform-ui-$VERSION.jar
