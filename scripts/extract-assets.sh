# This step is needed for S3 to find the assets in the root of the bucket and the 
# to avoid breaking the local references

cp -Rv dist/italladdsup/ dist
rm -r dist/italladdsup
